/** The Snowflake features Medynium runs on. Mirrors the web's list; update both together. */
export const SNOWFLAKE_FEATURES = [
  {
    name: 'Cortex Analyst',
    tagline: 'Questions to SQL',
    role: "Turns a plain-language question about a patient into SQL over a governed semantic view, so numbers come from the record and not from a model's memory.",
  },
  {
    name: 'Cortex Search',
    tagline: 'Cited drug labels',
    role: 'Finds the right passages in the indexed drug labels and returns them as quoted, dated sources.',
  },
  {
    name: 'Cortex AI models',
    tagline: 'Llama and Claude',
    role: 'A small model routes each question; a stronger model drafts the safety review. Both run through Snowflake, so patient data stays inside the platform.',
  },
  {
    name: 'Embeddings and vector search',
    tagline: 'Similar patients',
    role: 'Snowflake Arctic embeddings and vector similarity find patients with a comparable profile.',
  },
  {
    name: 'Cortex document parsing',
    tagline: 'Reads lab reports',
    role: 'Extracts text and layout from an uploaded report so a person can review it before anything is recorded.',
  },
  {
    name: 'Row access policies',
    tagline: 'Access in the database',
    role: 'Each person signs in under their own Snowflake role, and a row access policy shows them only the patients assigned to them. The assistant inherits the same limit.',
  },
] as const;
