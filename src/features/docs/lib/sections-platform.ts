import { SNOWFLAKE_FEATURES } from '@/constants/snowflake';

import type { DocSection } from '../types';

/** What Medynium runs on, for a reader who is not an engineer. The feature list is shared with sign-in. */
export const PLATFORM_SECTIONS: DocSection[] = [
  {
    id: 'built-on-snowflake',
    title: 'Built on Snowflake',
    summary: 'The Snowflake features behind each part of the product.',
    topics: [
      {
        title: 'Why one platform',
        body: 'Patient records, drug labels, access rules, audit history and the AI models all live in Snowflake. Nothing is copied out to a separate search or AI service, so the rules that protect a record also apply to the assistant.',
      },
      ...SNOWFLAKE_FEATURES.map((feature) => ({ title: feature.name, body: feature.role })),
      {
        title: 'How a request travels',
        body: 'This app talks only to the Medynium API, never to Snowflake directly. The API connects to Snowflake under your own role, so every request is limited to the patients assigned to you.',
      },
      {
        title: 'Built with Cortex Code',
        body: "The platform was set up, tested and audited with Snowflake's Cortex Code CLI. It is a build tool only and takes no part in producing an answer.",
      },
    ],
  },
];
