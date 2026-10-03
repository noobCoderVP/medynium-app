import { applyEvent, newTurn } from './stream-turn';

describe('applyEvent', () => {
  it('updates a step in place by id and finishes running steps on done', () => {
    let turn = newTurn('t1', 'q');
    turn = applyEvent(turn, { type: 'step', data: { step_id: 's1', label: 'Reading', status: 'running' } });
    turn = applyEvent(turn, {
      type: 'step',
      data: { step_id: 's1', label: 'Reading', status: 'done', detail: '3 items' },
    });
    turn = applyEvent(turn, { type: 'step', data: { step_id: 's2', label: 'Searching', status: 'running' } });
    expect(turn.steps).toHaveLength(2);
    expect(turn.steps[0].detail).toBe('3 items');
    turn = applyEvent(turn, { type: 'done', data: { audit_id: 'AUD-1' } });
    expect(turn.status).toBe('done');
    expect(turn.auditId).toBe('AUD-1');
    expect(turn.steps.every((s) => s.status === 'done')).toBe(true);
  });

  it('keeps a failure failed through done and gives a second route its own step ids', () => {
    let turn = newTurn('t1', 'q');
    turn = applyEvent(turn, { type: 'route', data: { route: 'action' } });
    turn = applyEvent(turn, { type: 'step', data: { step_id: 's1', label: 'a', status: 'done' } });
    turn = applyEvent(turn, { type: 'route', data: { route: 'safety' } });
    turn = applyEvent(turn, { type: 'step', data: { step_id: 's1', label: 'b', status: 'done' } });
    expect(turn.steps.map((s) => s.step_id)).toEqual(['1:s1', '2:s1']);
    turn = applyEvent(turn, { type: 'error', data: { error: 'agent_unavailable', message: 'down' } });
    turn = applyEvent(turn, { type: 'done', data: {} });
    expect(turn.status).toBe('failed');
  });
});
