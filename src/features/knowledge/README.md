# features/knowledge

**Purpose:** look up what the indexed drug labels say. Plain retrieval, no model call; every result is a quoted section with its source, version and dates.

**Endpoints:** `GET /knowledge/search` (`q`, `drug`, `limit`), `GET /knowledge/status`.

**Requirement IDs:** FR-10 to FR-15, AI-05, AI-08.

**Public surface (`index.ts`):** `KnowledgeView`.

**Rules:** an absence of results is stated as "not found in the indexed sources", never as safety. Sources that disagree are flagged. Results carry the Retrieved source tag.

**States handled:** loading skeleton, empty (with the server's own message when it sends one), error with retry and request id, rate limited.
