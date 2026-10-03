import { contentFromState, stateFromContent } from './view-content';

describe('saved view content', () => {
  it('stores only the tab and known filters', () => {
    expect(contentFromState('My view', 'timeline', { from: '2026-01-01', to: undefined, lab: '' })).toEqual({
      title: 'My view',
      tab: 'timeline',
      params: { from: '2026-01-01' },
    });
  });
  it('reads it back, ignoring unknown tabs and keys', () => {
    expect(stateFromContent({ tab: 'labs', params: { lab: '33914-3', why: 'ANS-1', from: 5 } })).toEqual({
      tab: 'labs',
      params: { lab: '33914-3' },
    });
    expect(stateFromContent({ tab: 'nope' })).toEqual({ tab: 'overview', params: {} });
  });
});
