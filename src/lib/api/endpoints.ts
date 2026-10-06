import { del, get, patch, post, postBlob, put } from './client';
import { normalizeOverview } from './normalize';
import type {
  ActionResponse,
  AiMetrics,
  Brief,
  BriefSummary,
  ChangeSet,
  ColleagueList,
  Finding,
  FindingList,
  FindingUpdate,
  GoldenRunList,
  HistoryList,
  MedicationIn,
  PatientCreate,
  WriteResult,
  ProposalResult,
  AuditPage,
  Briefing,
  Claims,
  Dashboard,
  Entitlements,
  EvidenceResponse,
  HealthDetails,
  InviteCreate,
  InviteCreated,
  InvitePage,
  InvitePreview,
  KnowledgeStatus,
  LabReviewed,
  LabPage,
  LabTrend,
  LoginResponse,
  Me,
  MedicationPage,
  NoteDetail,
  NotePage,
  OtpChallenge,
  PatientSummary,
  Overview,
  PatientPage,
  PendingPage,
  PendingSummary,
  Pin,
  PinList,
  ReportDetail,
  ReportList,
  ReportSummary,
  RowResult,
  SavedView,
  SearchResponse,
  SimilarResponse,
  ShareRequest,
  Timeline,
  UserItem,
  UserPage,
  UserPatch,
  ViewPreview,
} from './types';

type Params = Record<string, string | number | boolean | null | undefined>;

/** Builds "?a=1&b=2", skipping empty values. */
export function qs(params: Params = {}): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : '';
}

const pid = (id: string) => `/patients/${encodeURIComponent(id)}`;

/** Every API call the app makes. Hooks use these; components never do. */
export const endpoints = {
  // session
  /** A session, or an `OtpChallenge` when this deployment asks for the emailed code too. */
  login: (email: string, password: string) => post<LoginResponse | OtpChallenge>('/auth/login', { email, password }),
  verifyLogin: (challenge: string, code: string) => post<LoginResponse>('/auth/login/verify', { challenge, code }),
  forgotPassword: (email: string) => post<void>('/auth/password/forgot', { email }),
  logout: () => post<void>('/auth/logout'),
  me: () => get<Me>('/me'),
  changePassword: (current_password: string, new_password: string) =>
    post<void>('/auth/password', { current_password, new_password }),
  invitePreview: (token: string) => get<InvitePreview>(`/auth/invites/${encodeURIComponent(token)}`),
  acceptInvite: (token: string, password: string, display_name?: string) =>
    post<{ email: string }>('/auth/invites/accept', { token, password, display_name }),

  // dashboard and patients
  dashboard: () => get<Dashboard>('/dashboard'),
  briefing: () => get<Briefing>('/dashboard/briefing'),
  patients: (params: Params) => get<PatientPage>(`/patients${qs(params)}`),
  patient: (id: string) => get<Overview>(pid(id)).then(normalizeOverview),
  brief: (id: string) => get<Brief>(`${pid(id)}/brief`),
  briefSummary: (id: string) => get<BriefSummary>(`${pid(id)}/brief/summary`),
  patientSummary: (id: string) => get<PatientSummary>(`${pid(id)}/summary`),
  refreshPatientSummary: (id: string) => post<PatientSummary>(`${pid(id)}/summary/refresh`),
  reviewLab: (id: string, labId: string) => post<LabReviewed>(`${pid(id)}/labs/${encodeURIComponent(labId)}/review`),
  changes: (id: string, from: string) => get<ChangeSet>(`${pid(id)}/changes${qs({ from })}`),
  medications: (id: string, params: Params) => get<MedicationPage>(`${pid(id)}/medications${qs(params)}`),
  labs: (id: string, params: Params) => get<LabPage>(`${pid(id)}/labs${qs(params)}`),
  labTrend: (id: string, code: string) => get<LabTrend>(`${pid(id)}/labs/${encodeURIComponent(code)}/trend`),
  timeline: (id: string, params: Params) => get<Timeline>(`${pid(id)}/timeline${qs(params)}`),
  claims: (id: string, params: Params) => get<Claims>(`${pid(id)}/claims${qs(params)}`),
  notes: (id: string, params: Params) => get<NotePage>(`${pid(id)}/notes${qs(params)}`),
  sharePatient: (id: string, body: ShareRequest) => post<{ sent: boolean }>(`${pid(id)}/share`, body),
  note: (id: string, noteId: string) => get<NoteDetail>(`${pid(id)}/notes/${encodeURIComponent(noteId)}`),
  pins: (id: string) => get<PinList>(`${pid(id)}/pins`),
  addPin: (id: string, body: { answer_id: string; evidence_id: string; note?: string }) =>
    post<Pin>(`${pid(id)}/pins`, body, {
      'Idempotency-Key': `${body.answer_id}:${body.evidence_id}`,
    }),
  history: (id: string) => get<HistoryList>(`${pid(id)}/history${qs({ limit: 50 })}`),
  findings: (id: string) => get<FindingList>(`${pid(id)}/findings`),
  colleagues: (id: string) => get<ColleagueList>(`${pid(id)}/colleagues`),
  raiseFinding: (id: string, body: { answer_id: string; consideration_id: string }) =>
    post<Finding>(`${pid(id)}/findings`, body),
  decideFinding: (findingId: string, body: FindingUpdate) =>
    patch<Finding>(`/findings/${encodeURIComponent(findingId)}`, body),
  // writes (doctors only; the API re-checks the entitlement)
  createPatient: (body: PatientCreate, key: string) => post<WriteResult>('/patients', body, { 'Idempotency-Key': key }),
  addMedication: (id: string, body: MedicationIn, key: string) =>
    post<WriteResult>(`${pid(id)}/medications`, body, { 'Idempotency-Key': key }),
  removePin: (id: string, pinId: string) => del(`${pid(id)}/pins/${encodeURIComponent(pinId)}`),
  previewView: (body: { kind: 'SAVED_VIEW' | 'VISIT_BRIEF'; patient_id: string; content: Record<string, unknown> }) =>
    post<ViewPreview>('/views/preview', body),
  saveView: (preview_id: string, approved: boolean) => post<SavedView>('/views', { preview_id, approved }),
  views: (patientId?: string) => get<SavedView[]>(`/views${qs({ patient_id: patientId })}`),

  // pending work, similar patients, reports
  pending: (params: Params) => get<PendingPage>(`/pending${qs(params)}`),
  pendingSummary: () => get<PendingSummary>('/pending/summary'),
  similar: (id: string, params: Params) => get<SimilarResponse>(`${pid(id)}/similar${qs(params)}`),
  reports: (id: string) => get<ReportList>(`${pid(id)}/reports`),
  report: (id: string, reportId: string) => get<ReportDetail>(`${pid(id)}/reports/${encodeURIComponent(reportId)}`),
  uploadReport: (id: string, file: { blob: Blob; name: string; type: string }) =>
    postBlob<ReportSummary>(`${pid(id)}/reports`, file.blob, {
      'Content-Type': file.type || 'application/octet-stream',
      'X-Filename': encodeURIComponent(file.name),
    }),
  decideRow: (id: string, rowId: string, decision: 'accept' | 'reject', version: number) =>
    post<RowResult>(`${pid(id)}/reports/rows/${encodeURIComponent(rowId)}/${decision}`, { version }),
  approveReport: (id: string, reportId: string, confirm_identity: boolean) =>
    post<ReportDetail>(`${pid(id)}/reports/${encodeURIComponent(reportId)}/approve`, { confirm_identity }),
  rejectReport: (id: string, reportId: string) =>
    post<ReportSummary>(`${pid(id)}/reports/${encodeURIComponent(reportId)}/reject`),

  // agent and evidence
  evidence: (answerId: string) => get<EvidenceResponse>(`/evidence/${encodeURIComponent(answerId)}`),
  approveProposal: (id: string) => post<ProposalResult>(`/agent/proposals/${encodeURIComponent(id)}/approve`),
  discardProposal: (id: string) => post<{ status: string }>(`/agent/proposals/${encodeURIComponent(id)}/discard`),
  action: (action: string, params: Record<string, unknown>) =>
    post<ActionResponse>('/agent/actions', { action, params }),

  // knowledge and audit
  knowledgeSearch: (params: { q: string; drug?: string; section?: string; limit?: number }) =>
    get<SearchResponse>(`/knowledge/search${qs(params)}`),
  knowledgeStatus: () => get<KnowledgeStatus>('/knowledge/status'),
  audit: (params: Params) => get<AuditPage>(`/audit${qs(params)}`),
  aiMetrics: (days: number) => get<AiMetrics>(`/audit/summary${qs({ days })}`),

  // admin
  goldenRuns: () => get<GoldenRunList>('/admin/golden-runs'),
  healthDetails: () => get<HealthDetails>('/health/details'),
  users: (params: Params) => get<UserPage>(`/admin/users${qs(params)}`),
  patchUser: (id: string, body: UserPatch) => patch<UserItem>(`/admin/users/${encodeURIComponent(id)}`, body),
  entitlements: (id: string) => get<Entitlements>(`/admin/users/${encodeURIComponent(id)}/entitlements`),
  setEntitlements: (id: string, patient_ids: string[]) =>
    put<Entitlements>(`/admin/users/${encodeURIComponent(id)}/entitlements`, { patient_ids }),
  resetPassword: (id: string) => post<InviteCreated>(`/admin/users/${encodeURIComponent(id)}/reset-password`),
  invites: (params: Params) => get<InvitePage>(`/admin/invites${qs(params)}`),
  createInvite: (body: InviteCreate) => post<InviteCreated>('/admin/invites', body),
  revokeInvite: (id: string) => del(`/admin/invites/${encodeURIComponent(id)}`),
};
