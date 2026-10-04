import type { DocSection } from '../types';
import { PLATFORM_SECTIONS } from './sections-platform';
import { TRUST_SECTIONS } from './sections-trust';

/** The phone guide, written for clinicians. Keep it in step with the screens; the trust sections match the web's. */
export const DOC_SECTIONS: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    summary: 'What Medynium is and how the app is laid out.',
    topics: [
      {
        title: 'What is Medynium?',
        body: "Medynium brings one patient's record together (encounters, medications, labs, claims and notes) and adds an assistant that answers questions about it with sources. It supports your decisions; it does not diagnose or replace clinical judgement. All data in this environment is synthetic.",
      },
      {
        title: 'Finding your way',
        body: 'The bar at the bottom has five places: Home, Patients, Pending, Ask and More. More holds Knowledge, Activity, this guide, Admin (for administrators), your account and the light, dark or system theme.',
      },
      {
        title: 'Your first patient review',
        body: 'Open Patients, search by name or condition and tap a row. Start on Overview for what needs attention, then move through the tabs. Ask the assistant a question, and tap Why? on any statement to see its evidence.',
      },
    ],
  },
  {
    id: 'home-and-pending',
    title: 'Home and Pending',
    summary: 'What changed and what is waiting on you.',
    topics: [
      {
        title: 'Home',
        body: 'Your worklist of patients who changed, utilisation counts and recent lab and medicine changes. Brief me summarises the changes only when you ask; Home works without it.',
      },
      {
        title: 'Pending work',
        body: 'Everything waiting on you across your own patients: escalated and open safety findings, follow-ups due, reports to review, abnormal labs and recent emergency visits. Filter by kind, and tap an item to open the patient on the tab where it is handled. Overdue follow-ups are marked.',
      },
    ],
  },
  {
    id: 'patients',
    title: 'Patients',
    summary: 'Finding a patient and reading the record.',
    topics: [
      {
        title: 'Patient 360 and its tabs',
        body: 'Overview, Timeline, Medicines, Labs, Safety, Claims, Notes, Reports and Similar each show one slice of the record. The header names the patient, the date the record is current to and any recorded allergies. "No allergies recorded" means none are on file, not that none are known.',
      },
      {
        title: 'Needs attention',
        body: 'On Overview, every lab outside its reference range is listed with its range and how it moved since the previous result. The reasons come only from recorded values. Tap a result for its trend, or Review safety to open the safety review.',
      },
      {
        title: 'Similar patients and Reports',
        body: 'Similar lists your other patients with a real overlap in diagnoses, medicines, labs or age, and is never padded. Reports shows uploaded reports and what was read from them. On Reports you can upload a PDF or photo, accept or reject each row read from it, and approve; only accepted rows are written to the record, and only when you approve.',
      },
      {
        title: 'A patient you cannot find',
        body: 'If a patient does not exist or you are not entitled to see them, the screen looks the same in both cases. This is deliberate.',
      },
    ],
  },
  {
    id: 'assistant',
    title: 'Ask',
    summary: 'Asking questions, and what the answers mean.',
    topics: [
      {
        title: 'Asking questions',
        body: 'Ask in plain language. The scope pill shows which patient the assistant is looking at; open a patient first to scope it.',
      },
      {
        title: 'Evidence and citations',
        body: "Every statement carries a tag: Patient fact (from the record), Retrieved source (from a drug label) or AI synthesis (the assistant's own reasoning). Tap Why? beside a statement to see the supporting items.",
      },
      {
        title: 'What the AI does not do',
        body: 'It does not diagnose, prescribe or act on a patient. It can be wrong or unavailable; when it is, the workspace keeps working and you can use the manual controls.',
      },
    ],
  },
  {
    id: 'privacy-on-the-phone',
    title: 'Privacy on this phone',
    summary: 'What stays on the device.',
    topics: [
      {
        title: 'Nothing clinical is stored',
        body: "Only your sign-in token is kept, in the phone's secure storage. Patient data lives in memory and is cleared when you sign out. The app locks after a minute away.",
      },
      {
        title: 'Offline',
        body: 'Without a connection screens cannot load. A banner says so and disappears when the connection is back; screens then refresh by themselves.',
      },
    ],
  },
  ...PLATFORM_SECTIONS,
  ...TRUST_SECTIONS,
];
