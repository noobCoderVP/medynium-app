import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '@/lib/api/errors';
import type { StreamAnswer } from '@/lib/api/events';
import { patientKeys } from '@/lib/api/keys';
import { streamPost } from '@/lib/api/sse';
import { applyEvent, newTurn, type Turn } from '@/lib/stream-turn';

/**
 * The manual "Run safety review" (FR-20). Streams the same steps the assistant would show. The last answer is
 * kept in the in-memory cache only; the stored evidence on the server is the record.
 */
export function useSafetyReview(patientId: string) {
  const queryClient = useQueryClient();
  const saved = useQuery<StreamAnswer | null>({
    queryKey: patientKeys.safety(patientId),
    queryFn: () => null,
    enabled: false,
    staleTime: Infinity,
  });
  const [turn, setTurn] = useState<Turn | null>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => () => abort.current?.abort(), []);

  const run = useCallback(async () => {
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    let current = newTurn(`safety-${Date.now()}`, 'Safety review');
    setTurn(current);
    try {
      await streamPost(`/patients/${encodeURIComponent(patientId)}/safety-review`, {
        signal: controller.signal,
        onEvent: (event) => {
          current = applyEvent(current, event);
          setTurn(current);
          if (event.type === 'answer') queryClient.setQueryData(patientKeys.safety(patientId), event.data);
        },
      });
      if (current.status === 'running') setTurn(applyEvent(current, { type: 'done', data: {} }));
    } catch (error) {
      if (controller.signal.aborted) return;
      const api = error instanceof ApiError ? error : null;
      setTurn({
        ...current,
        status: 'failed',
        error: {
          code: api?.code ?? 'network',
          message: api?.message ?? 'We could not reach the server.',
          retryAfter: api?.retryAfter ?? null,
        },
      });
    }
  }, [patientId, queryClient]);

  return { turn, answer: saved.data ?? turn?.answers.at(-1) ?? null, run, running: turn?.status === 'running' };
}
