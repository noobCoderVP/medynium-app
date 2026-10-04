/**
 * All system wording in one place (X-5). Refusal, gap, error, banner and empty-state text never appears
 * inline in a component, so wording is reviewed and changed here. Rules: 05-ux-design.md section 8.
 * Never write "no risk" or "safe" for an absence of evidence.
 */
export const copy = {
  banner: 'Synthetic data for demonstration. Decision support only, not a diagnosis or treatment tool.',

  tags: {
    patient_fact: { label: 'Patient fact', hint: "Read from this patient's record" },
    retrieved_source: { label: 'Retrieved source', hint: 'Quoted from an indexed drug label' },
    ai_synthesis: { label: 'AI synthesis', hint: 'May warrant clinician review' },
    rule_check: { label: 'Rule check', hint: "Found by a fixed rule on this patient's record, not by the AI" },
  },
  synthesisHedge: 'May warrant clinician review',

  gap: {
    title: 'No documented consideration found in the indexed sources.',
    checked: 'What I checked',
    notChecked: 'What I could not check',
    snapshot: 'Source snapshot',
    note: 'This is not a statement that there is no risk. It only reflects what the indexed sources contain.',
  },

  notFound: {
    patient: {
      title: "We couldn't find that patient.",
      body: 'Check the link, or search your patient list.',
    },
    evidence: {
      title: "We couldn't find that answer's evidence.",
      body: 'It may belong to another account or no longer exist.',
    },
    page: { title: "That page doesn't exist.", body: 'Use the navigation to find what you need.' },
  },

  agent: {
    unavailable: 'The assistant is unavailable. You can still review this patient and run the safety review yourself.',
    unavailableShort: 'The assistant is unavailable right now.',
    noScope: 'All my patients',
    scope: (name: string) => `Scope: ${name}`,
    placeholder: 'Ask or tell me what to do',
    noModel: 'no model call',
    empty:
      'Ask about one patient, or about all of your patients. Pick a patient above, ask about a drug or a condition, or say what you want opened.',
    refusalHeading: "I can't help with that here",
    thinking: 'Working on it',
  },

  errors: {
    unavailable: 'This is not available from the connected server yet. Update the server, then try again.',
    generic: 'Something went wrong on our side.',
    network: "We couldn't reach the server. Check your connection and try again.",
    rateLimited: (seconds: number | null) =>
      seconds ? `Too many requests. Try again in ${seconds} seconds.` : 'Too many requests. Try again shortly.',
    forbidden: "Your role can't open this page.",
    notImplemented: "This feature isn't available yet.",
    requestId: (id: string) => `Request ${id}`,
  },

  empty: {
    worklist: 'No patients on your list yet. Ask an administrator to assign patients.',
    patients: 'No patients match. Try a different name or condition.',
    timeline: 'No events in this range. Widen the dates or clear the filter.',
    medications: 'No medications on record for this view.',
    labs: 'No lab results on record.',
    claims: 'No claims on record.',
    notes: 'No notes on record.',
    audit: 'No activity matches these filters.',
    knowledge: 'No matching section in the indexed sources.',
    pins: "Nothing pinned yet. Open an answer's evidence and pin what you want to keep.",
  },

  auth: {
    signInError: "That email and password don't match. Check them and try again.",
    locked: 'Too many attempts. Wait a minute, then try again.',
    inviteInvalid: 'This link is no longer valid. Ask your administrator for a new one.',
    inviteDone: 'Your password is set. You can sign in now.',
    otpWrong: 'That code is incorrect or has expired. Check it, or sign in again for a new one.',
    otpSendFailed: 'We could not send your sign-in code. Try again in a moment.',
    forgotSent:
      'If that email belongs to an active account, a reset link is on its way. It works once and expires in 72 hours.',
  },

  loadingSlow: 'Still working. This can take a few seconds.',
} as const;

export type TagKey = keyof typeof copy.tags;
