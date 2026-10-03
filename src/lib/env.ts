import { z } from 'zod';

// Only EXPO_PUBLIC_* values are bundled into the app. Never put a secret in one.
const schema = z.object({
  EXPO_PUBLIC_API_URL: z.url().default('http://localhost:8000'),
});

const parsed = schema.parse({ EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL || undefined });

export const env = { apiUrl: parsed.EXPO_PUBLIC_API_URL.replace(/\/$/, '') };
