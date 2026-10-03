/** Query-key factories: one place for keys so invalidation is precise and typos are impossible. */
export const sessionKeys = { me: ['session', 'me'] as const };

export const dashboardKeys = {
  all: ['dashboard'] as const,
  briefing: ['dashboard', 'briefing'] as const,
};

export const patientKeys = {
  all: ['patients'] as const,
  list: (params: object) => ['patients', 'list', params] as const,
  detail: (id: string) => ['patients', id, 'detail'] as const,
  medications: (id: string, params: object) => ['patients', id, 'medications', params] as const,
  labs: (id: string, params: object = {}) => ['patients', id, 'labs', params] as const,
  trend: (id: string, code: string) => ['patients', id, 'labs', code, 'trend'] as const,
  timeline: (id: string, params: object) => ['patients', id, 'timeline', params] as const,
  claims: (id: string, params: object) => ['patients', id, 'claims', params] as const,
  notes: (id: string, params: object) => ['patients', id, 'notes', params] as const,
  note: (id: string, noteId: string) => ['patients', id, 'notes', noteId] as const,
  pins: (id: string) => ['patients', id, 'pins'] as const,
  views: (id: string) => ['patients', id, 'views'] as const,
  /** The last safety review run in this session (held in the cache only; the stored evidence is the record). */
  safety: (id: string) => ['patients', id, 'safety'] as const,
};

export const evidenceKeys = { one: (answerId: string) => ['evidence', answerId] as const };

export const knowledgeKeys = {
  search: (q: string, drug: string, section: string) => ['knowledge', 'search', { q, drug, section }] as const,
  status: ['knowledge', 'status'] as const,
};

export const auditKeys = {
  list: (filters: object) => ['audit', filters] as const,
};

export const adminKeys = {
  health: ['admin', 'health'] as const,
  users: (params: object) => ['admin', 'users', params] as const,
  entitlements: (id: string) => ['admin', 'users', id, 'entitlements'] as const,
  invites: ['admin', 'invites'] as const,
  invitePage: (params: object) => ['admin', 'invites', 'page', params] as const,
};
