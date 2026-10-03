import { parseStreamEvent } from './events';
import { createFrameParser, type RawFrame } from './sse';

const stream =
  'event: step\ndata: {"step_id":"s1","label":"Reading","status":"running"}\n\n' +
  ': keepalive\n\n' +
  'event: done\ndata: {"audit_id":"AUD-1"}\n\n';

describe('SSE frame parser', () => {
  it('parses whole frames and ignores keepalive comments', () => {
    const frames = createFrameParser()(stream);
    expect(frames.map((f) => f.event)).toEqual(['step', 'done']);
  });

  it('reassembles frames split at awkward boundaries', () => {
    const parse = createFrameParser();
    const frames: RawFrame[] = [];
    for (let i = 0; i < stream.length; i += 7) frames.push(...parse(stream.slice(i, i + 7)));
    expect(frames.map((f) => f.event)).toEqual(['step', 'done']);
    expect(JSON.parse(frames[0].data).step_id).toBe('s1');
  });

  it('handles CRLF line endings', () => {
    const frames = createFrameParser()('event: done\r\ndata: {"audit_id":"A"}\r\n\r\n');
    expect(frames).toEqual([{ event: 'done', data: '{"audit_id":"A"}' }]);
  });
});

describe('stream event validation', () => {
  it('accepts a valid step', () => {
    const event = parseStreamEvent('step', '{"step_id":"s1","label":"x","status":"done"}');
    expect(event?.type).toBe('step');
  });
  it('drops an invalid payload, malformed JSON and unknown events', () => {
    expect(parseStreamEvent('step', '{"label":"missing id"}')).toBeNull();
    expect(parseStreamEvent('step', '{oops')).toBeNull();
    expect(parseStreamEvent('mystery', '{}')).toBeNull();
  });
  it('rejects an answer whose tag is not one of the three', () => {
    const answer = {
      answer_id: 'A',
      kind: 'SAFETY',
      patient_id: null,
      short_answer: 'x',
      considerations: [{ id: 'C1', text: 't', tag: 'made_up' }],
      limits: {},
      created_at: '2026-10-03T00:00:00Z',
    };
    expect(parseStreamEvent('answer', JSON.stringify(answer))).toBeNull();
  });
});
