import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { AppState } from 'react-native';

import { ApiError } from '@/lib/api/errors';
import { streamPost } from '@/lib/api/sse';
import { resetScope, type OpenPatient } from '@/lib/open-patient';
import { applyEvent, newTurn, type Turn } from '@/lib/stream-turn';

const HISTORY = 4;

interface AgentValue {
  turns: Turn[];
  running: boolean;
  /** Ask or tell. `scope` is the chosen patient, or null for all of the clinician's patients (context only; the server re-checks access). */
  ask: (question: string, scope: OpenPatient | null) => Promise<void>;
  stop: () => void;
  clear: () => void;
}

const AgentContext = createContext<AgentValue | null>(null);

/**
 * Conversation state for the Ask tab. Mounted at the root so it survives tab switches. Nothing is stored on the device:
 * the turns live in memory and are dropped on sign-out (the provider unmounts with the session).
 */
export function AgentProvider({ children }: PropsWithChildren) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const turnsRef = useRef<Turn[]>([]);
  const abort = useRef<AbortController | null>(null);

  const update = useCallback((next: Turn[]) => {
    turnsRef.current = next;
    setTurns(next);
  }, []);
  const patch = useCallback(
    (id: string, change: (turn: Turn) => Turn) => update(turnsRef.current.map((t) => (t.id === id ? change(t) : t))),
    [update],
  );

  const stop = useCallback(() => abort.current?.abort(), []);

  // A stream cannot survive the app leaving the foreground. End it cleanly so the user can ask again.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') abort.current?.abort();
    });
    return () => {
      sub.remove();
      abort.current?.abort();
      resetScope(); // the provider unmounts on sign-out: nothing about who was asked about survives
    };
  }, []);

  const ask = useCallback(
    async (question: string, scope: OpenPatient | null) => {
      const patientId = scope?.id ?? null;
      abort.current?.abort();
      const controller = new AbortController();
      abort.current = controller;
      const history = turnsRef.current.slice(-HISTORY).map((t) => t.question);
      const lastAnswerId = turnsRef.current.at(-1)?.answers.at(-1)?.answer_id ?? null;
      const id = `turn-${Date.now()}`;
      update([...turnsRef.current, newTurn(id, question, scope?.name ?? 'All my patients')]);
      try {
        await streamPost('/copilot/ask', {
          body: {
            question,
            screen: patientId ? 'patient' : 'dashboard',
            patient_id: patientId,
            history,
            last_answer_id: lastAnswerId,
          },
          signal: controller.signal,
          onEvent: (event) => patch(id, (turn) => applyEvent(turn, event)),
        });
        patch(id, (turn) => (turn.status === 'running' ? applyEvent(turn, { type: 'done', data: {} }) : turn));
      } catch (error) {
        if (controller.signal.aborted) {
          patch(id, (turn) => ({
            ...turn,
            status: 'failed',
            error: { code: 'interrupted', message: 'Stopped. Ask again when you are ready.', retryAfter: null },
          }));
          return;
        }
        const api = error instanceof ApiError ? error : null;
        patch(id, (turn) => ({
          ...turn,
          status: 'failed',
          error: {
            code: api?.code ?? 'network',
            message: api?.message ?? 'We could not reach the server.',
            retryAfter: api?.retryAfter ?? null,
          },
        }));
      }
    },
    [patch, update],
  );

  const value = useMemo<AgentValue>(
    () => ({ turns, running: turns.at(-1)?.status === 'running', ask, stop, clear: () => update([]) }),
    [turns, ask, stop, update],
  );
  return <AgentContext value={value}>{children}</AgentContext>;
}

export function useAgent() {
  const ctx = use(AgentContext);
  if (!ctx) throw new Error('useAgent must be used inside AgentProvider');
  return ctx;
}
