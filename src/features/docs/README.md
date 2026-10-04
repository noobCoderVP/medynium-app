# features/docs

**Purpose:** the clinician's user guide on the phone (web `/docs`), reached from More. Static text: no endpoints, no patient data.

**Public surface (`index.ts`):** `DocsView`.

**Content:** `lib/sections.ts` is the phone guide (kept in step with the screens); `lib/sections-trust.ts` (how answers are produced, security, limits, FAQ) is copied from the web and should be updated in both places.

**States handled:** none needed (static). Section chips are buttons with selected state; headings are marked as headers.
