import type { StreamAction, StreamAnswer, StreamEvent, StreamRefusal, StreamRoute, StreamStep } from '@/lib/api/events';

export interface TurnError {
  code: string;
  message: string;
  retryAfter: number | null;
}

/** One request to the assistant (or one safety run) and everything that came back for it. */
export interface Turn {
  id: string;
  question: string;
  status: 'running' | 'done' | 'failed';
  routes: StreamRoute[];
  steps: StreamStep[];
  actions: StreamAction[];
  answers: StreamAnswer[];
  refusal: StreamRefusal | null;
  error: TurnError | null;
  auditId: string | null;
}

export const newTurn = (id: string, question: string): Turn => ({
  id,
  question,
  status: 'running',
  routes: [],
  steps: [],
  actions: [],
  answers: [],
  refusal: null,
  error: null,
  auditId: null,
});

/** Applies one validated stream event. Steps update in place by id; a second route gets its own step ids. */
export function applyEvent(turn: Turn, event: StreamEvent): Turn {
  switch (event.type) {
    case 'route':
      return { ...turn, routes: [...turn.routes, event.data] };
    case 'step': {
      const step = { ...event.data, step_id: `${turn.routes.length}:${event.data.step_id}` };
      const exists = turn.steps.some((s) => s.step_id === step.step_id);
      return {
        ...turn,
        steps: exists ? turn.steps.map((s) => (s.step_id === step.step_id ? step : s)) : [...turn.steps, step],
      };
    }
    case 'action':
      return { ...turn, actions: [...turn.actions, event.data] };
    case 'answer':
      return { ...turn, answers: [...turn.answers, event.data] };
    case 'refusal':
      return { ...turn, refusal: event.data };
    case 'error':
      return {
        ...turn,
        status: 'failed',
        error: { code: event.data.error, message: event.data.message, retryAfter: null },
      };
    case 'done':
      return {
        ...turn,
        status: turn.status === 'failed' ? 'failed' : 'done',
        auditId: event.data.audit_id ?? null,
        steps: turn.steps.map((s) => (s.status === 'running' ? { ...s, status: 'done' } : s)),
      };
  }
}
