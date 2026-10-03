import { z } from 'zod';

// The stream and the answer object come from a model-adjacent path, so they are validated at the
// boundary (06 section 2). Plain reads trust the generated types instead.

const tag = z.enum(['patient_fact', 'retrieved_source', 'ai_synthesis']);

export const answerSchema = z.object({
  answer_id: z.string(),
  kind: z.string(),
  patient_id: z.string().nullable(),
  short_answer: z.string(),
  considerations: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      tag,
      patient_evidence: z.array(z.string()).default([]),
      source_evidence: z.array(z.string()).default([]),
    }),
  ),
  limits: z.object({
    checked: z.array(z.string()).default([]),
    not_checked: z.array(z.string()).default([]),
    notes: z.array(z.string()).default([]),
    snapshot_date: z.string().nullish(),
  }),
  conflicts: z
    .array(
      z.object({
        drug: z.string().nullable(),
        section: z.string().nullish(),
        items: z.array(z.string()),
      }),
    )
    .default([]),
  route: z
    .object({
      route: z.string(),
      model: z.string().nullish(),
      confidence: z.number().nullish(),
      cost_note: z.string().nullish(),
    })
    .nullish(),
  created_at: z.string(),
});

export const routeSchema = z.object({
  route: z.string(),
  model: z.string().nullish(),
  confidence: z.number().nullish(),
  reason: z.string().nullish(),
  cost_note: z.string().nullish(),
  fallback: z.boolean().optional(),
  escalated: z.boolean().optional(),
});

export const stepSchema = z.object({
  step_id: z.string(),
  label: z.string(),
  status: z.enum(['running', 'done', 'failed']),
  detail: z.string().nullish(),
});

export const actionSchema = z.object({
  action: z.string(),
  params: z.record(z.string(), z.unknown()).default({}),
  status: z.string(),
  result: z.record(z.string(), z.unknown()).default({}),
});

export const refusalSchema = z.object({
  message: z.string(),
  reason: z.string(),
  considerations: z
    .array(
      z.object({
        text: z.string(),
        drug: z.string().nullish(),
        section: z.string().nullish(),
        title: z.string().nullish(),
        version: z.string().nullish(),
        effective_date: z.string().nullish(),
      }),
    )
    .default([]),
});

export const errorSchema = z.object({ error: z.string(), message: z.string() });
export const doneSchema = z.object({ audit_id: z.string().nullish() });

export type StreamAnswer = z.infer<typeof answerSchema>;
export type StreamRoute = z.infer<typeof routeSchema>;
export type StreamStep = z.infer<typeof stepSchema>;
export type StreamAction = z.infer<typeof actionSchema>;
export type StreamRefusal = z.infer<typeof refusalSchema>;

export type StreamEvent =
  | { type: 'route'; data: StreamRoute }
  | { type: 'step'; data: StreamStep }
  | { type: 'action'; data: StreamAction }
  | { type: 'answer'; data: StreamAnswer }
  | { type: 'refusal'; data: StreamRefusal }
  | { type: 'error'; data: z.infer<typeof errorSchema> }
  | { type: 'done'; data: z.infer<typeof doneSchema> };

const schemas = {
  route: routeSchema,
  step: stepSchema,
  action: actionSchema,
  answer: answerSchema,
  refusal: refusalSchema,
  error: errorSchema,
  done: doneSchema,
} as const;

/** Validates one frame. Unknown event names and invalid payloads return null and are skipped. */
export function parseStreamEvent(name: string, raw: string): StreamEvent | null {
  const schema = schemas[name as keyof typeof schemas];
  if (!schema) return null;
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return null;
  }
  const parsed = schema.safeParse(json);
  return parsed.success ? ({ type: name, data: parsed.data } as StreamEvent) : null;
}
