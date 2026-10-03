import { request } from './client';
import { parseStreamEvent, type StreamEvent } from './events';

export interface RawFrame {
  event: string;
  data: string;
}

/**
 * Incremental parser for "event:" and "data:" frames. Feed it text as it arrives; it returns the frames
 * completed so far and keeps the unfinished tail. Comment lines (": keepalive") are ignored.
 */
export function createFrameParser() {
  let buffer = '';
  return (chunk: string): RawFrame[] => {
    buffer += chunk;
    const frames: RawFrame[] = [];
    let boundary = buffer.search(/\r?\n\r?\n/);
    while (boundary !== -1) {
      const block = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary).replace(/^\r?\n\r?\n/, '');
      let event = 'message';
      const data: string[] = [];
      for (const line of block.split(/\r?\n/)) {
        if (line.startsWith(':')) continue;
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''));
      }
      if (data.length > 0) frames.push({ event, data: data.join('\n') });
      boundary = buffer.search(/\r?\n\r?\n/);
    }
    return frames;
  };
}

/**
 * POSTs and reads the response as a server-sent-event stream. fetch is used because EventSource is GET-only.
 * Errors before the stream opens (404, 429, 503) throw an ApiError, exactly like any other call.
 */
export async function streamPost(
  path: string,
  options: { body?: unknown; signal?: AbortSignal; onEvent: (event: StreamEvent) => void },
): Promise<void> {
  const response = await request(path, {
    method: 'POST',
    body: options.body,
    signal: options.signal,
    accept: 'text/event-stream',
  });
  if (!response.body) return;
  const parse = createFrameParser();
  const decoder = new TextDecoder();
  const reader = response.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const frame of parse(decoder.decode(value, { stream: true }))) {
      const event = parseStreamEvent(frame.event, frame.data);
      if (event) options.onEvent(event);
    }
  }
}
