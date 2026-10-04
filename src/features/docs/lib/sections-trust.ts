import type { DocSection } from '../types';

/** How answers are produced, security, limits and FAQ: the trust material, kept apart from the screen guide. */
export const TRUST_SECTIONS: DocSection[] = [
  {
    id: 'how-answers-work',
    title: 'How answers are produced',
    summary: 'What the assistant reads, what it checks, and what it will not do.',
    topics: [
      {
        title: 'From question to answer',
        body: "A small model decides which kind of question you asked. The server then reads only this patient's record under your own access, searches the indexed drug labels, and asks a language model to draft statements. A separate checker then removes anything the evidence does not back before you see it.",
      },
      {
        title: 'What the checker removes',
        body: 'Statements with no matching evidence, statements tagged as something they are not, text that looks like an instruction copied from a document, anything that prescribes, doses or diagnoses, and any wording that says a medicine is safe or carries no risk. The short summary at the top is written by the system from what survived, not by the model.',
      },
      {
        title: 'Medicines with no indexed label',
        body: "If a medicine has no label in the index, it cannot be checked, and the review says so. A conclusion that rests only on such medicines is removed by a rule in the server, not left to the model's judgement.",
      },
      {
        title: 'Rule checks',
        body: 'Some conclusions come from a fixed rule on the record rather than from the model, for example an allergy recorded to a medicine the patient is currently taking. These carry a Rule check tag, never AI synthesis, and the review lists how many came from a rule.',
      },
      {
        title: 'Opening the evidence',
        body: 'Every statement has a Why? button. It shows the patient records, the exact label passages, their document, section, version and dates. "How this was answered" lists the steps taken and which model was used.',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security and access',
    summary: 'Who can see what, and what is recorded.',
    topics: [
      {
        title: 'Patient access',
        body: 'Access is enforced inside the database, per user, not only by the screens. You can open only patients assigned to you. An assistant can only be assigned patients their supervising doctor holds. A patient you cannot open looks identical to one that does not exist.',
      },
      {
        title: 'What is recorded',
        body: "Questions and actions, denied attempts, emailed summaries (recording the recipient's domain, never the address or the text) and each time a chart is opened. Records can be added to but not edited by users.",
      },
      {
        title: 'Emailing a summary',
        body: 'A summary can be emailed to one person. An administrator can restrict recipients to approved domains. Email is not a secure channel; send only what the recipient needs.',
      },
      {
        title: 'Sign-in',
        body: 'Passwords are stored as hashes, accounts lock after repeated failures, sessions rotate their tokens, and administrators can require a one-time code by email. Single sign-on and authenticator-app codes are not available yet.',
      },
    ],
  },
  {
    id: 'limits',
    title: 'Limits and known gaps',
    summary: 'What Medynium does not cover yet.',
    topics: [
      {
        title: 'Data',
        body: 'All data here is synthetic. The record is loaded in batches by an administrator; you cannot yet add or correct patients, medicines, results or allergies in the app. An empty allergy list means none are recorded, not that none are known.',
      },
      {
        title: 'Evidence',
        body: 'The indexed drug labels cover a limited set of medicines and are US labelling, not Indian regulatory text. A review that finds nothing means nothing was found in those sources. It is never a statement that there is no risk.',
      },
      {
        title: 'Not a medical device',
        body: 'Medynium supports your decisions. It does not diagnose, prescribe or replace clinical judgement, and it can be wrong or unavailable.',
      },
    ],
  },
  {
    id: 'faq',
    title: 'Frequently asked questions',
    summary: 'Short answers.',
    topics: [
      {
        title: 'Why is a patient I expect missing?',
        body: 'Either they are not assigned to you or they do not exist; the screen is deliberately the same for both. Ask an administrator to check your assignments.',
      },
      {
        title: 'Why did the review say nothing was found?',
        body: "Either the medicines were checked and the labels contain nothing relevant to this patient's results, or a medicine has no indexed label. The answer lists which of the two applies.",
      },
      {
        title: "Why can't I see billing on the overview?",
        body: 'The clinical view shows only what a clinical decision needs. Claims and amounts are on the Claims tab.',
      },
      {
        title: 'Can the assistant change the record?',
        body: 'No. It can open a patient, show a timeline or lab trend, run the safety review and pin evidence. Nothing else.',
      },
    ],
  },
];
