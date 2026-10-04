# Smoke tests (on a real phone)

Run after every EAS build, against the API you built for. Accounts: `sharma@demo.medynium` (doctor) and `assistant@demo.medynium` (assistant). Tick each line; a failure is a bug, not a note.

## Session

- [ ] Wrong password shows "That email and password don't match", not a crash.
- [ ] Right password signs in (with the emailed code step if the deployment asks for it).
- [ ] Kill the app and reopen: still signed in, no sign-in flash.
- [ ] Turn the API off, reopen: the "could not reach Medynium" screen with Try again; turn it on, Try again works. You were not signed out.
- [ ] Sign out lands on sign-in; reopening stays signed out.

- [ ] Turn on airplane mode: the offline banner appears. Turn it off: the banner disappears within a few seconds and the open screen refreshes by itself.
- [ ] Sign-in, forgot password and invitation screens sit in the vertical centre, and stay usable with the keyboard open.

## Navigation

- [ ] The bottom bar shows exactly five items: Home, Patients, Pending, Ask, More.
- [ ] More lists Knowledge, Activity, Documentation, Admin (admin doctors only), Change password and Sign out; Back from Knowledge, Activity and Documentation returns to More.

## Pending

- [ ] Pending shows "N open, M overdue", the kind chips filter the list, and a tap opens the patient on the matching tab (Safety, Reports, Labs, Notes or Timeline).

## Home and Patients

- [ ] Home shows tiles, what changed, and your worklist; the synthetic-data banner is visible.
- [ ] "Brief me" runs only when pressed and says it is rules, not a model.
- [ ] Doctor sees their patients; the assistant never sees S3.
- [ ] Patients search narrows the list after typing stops; "Changed recently" filters; the list pages as you scroll.

## Patient workspace

- [ ] All nine sections (Overview, Timeline, Medicines, Labs, Safety, Claims, Notes, Reports, Similar) load for S1 and match the web app.
- [ ] The header shows allergies as words with an icon, or "No allergies recorded"; Overview's Needs attention panel lists out-of-range labs with range and movement, a tap opens the trend, and Review safety opens the Safety tab.
- [ ] Similar lists real matches with reasons (never padded); Reports lists uploads and opens each row with its quote and page. Upload a PDF or photo, accept or reject rows, approve: only accepted rows reach Labs, Medicines or Diagnoses. A name mismatch asks for confirmation first.
- [ ] Labs: tapping a test opens the trend with the reference band and the values as text.
- [ ] A patient id you are not entitled to, and a made-up id, show the identical "We couldn't find that patient." screen.

## Evidence and the assistant

- [ ] S1 Safety tab: Run safety review streams steps, shows tagged statements (icon plus words) including metformin and eGFR; each statement's Why? opens the sheet with the linked items highlighted; Android Back closes it.
- [ ] S2 shows the honest gap wording, never "no risk".
- [ ] Ask tab: scope pill shows the open patient; "Open the kidney-disease patient and run the safety review" gives an Open button that lands on the Safety tab.
- [ ] A prescribing request is refused calmly with label considerations.
- [ ] Leave the app mid-answer and return: the turn says it stopped and offers Ask again; nothing hangs.
- [ ] With the agent failing, the workspace and manual safety review still work.

## Knowledge, Activity, You

- [ ] Knowledge search returns quoted sections with version and dates; "Show full text" expands.
- [ ] Activity lists your questions and actions, including a denial.
- [ ] Change password works, and the other device is signed out.

## Saved views, sharing and admin

- [ ] Patient header: Saved views previews first, writes nothing until "Approve and save", then lists the view; opening it restores the tab and filters.
- [ ] Email a summary sends only after the button; the send appears in Activity.
- [ ] Admin (doctor with is_admin only): Health, Users (cannot disable yourself) and Invites (create, revoke).

## Privacy and lock

- [ ] Screenshots are blocked and the recent-apps card is blank while signed in.
- [ ] Leave the app for over a minute and return: the lock cover appears and asks for fingerprint, face or screen lock; Cancel then "Sign out instead" works.
- [ ] Unlocking returns to the same screen; nothing was visible under the cover.

## Invitations

- [ ] Sign-in: "I have an invitation" accepts a pasted link or code, shows who it is for, sets the password, and returns to sign-in. A used or expired link says it is no longer valid.
- [ ] `medynium://invite/<token>` opens the same screen from outside the app.

## Look and feel

- [ ] Home greets you by time of day, tiles count up once, and a content-shaped skeleton shows while loading.
- [ ] You tab: Appearance (System, Light, Dark) switches at once and is remembered after a restart.
- [ ] Patient rows show initials; tab presses give a light tick.

- [ ] The logo (heart-pulse in a blue rounded square, then "Medynium") is top left on every tab and on sign-in; the launcher icon and splash match.
- [ ] Press scale on buttons and cards, staggered list entrances, tab icon spring, sheets spring up and close on a drag down or flick.
- [ ] Assistant shows animated dots while working.
- [ ] With "Remove animations" on in Android settings, motion is skipped.

## Accessibility

- [ ] TalkBack reads every button and tag; font size at 200 percent has no clipped text.
- [ ] Light and dark are both readable (`npm run contrast` passes).
