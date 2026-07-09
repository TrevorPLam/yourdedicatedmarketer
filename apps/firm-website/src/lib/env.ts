import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .url({ message: 'NEXT_PUBLIC_SITE_URL must be a valid URL' })
    .default('http://localhost:3000'),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required').default('test_key'),
  CONTACT_EMAIL: z.email('CONTACT_EMAIL must be a valid email').default('test@example.com'),
  FROM_EMAIL: z.email('FROM_EMAIL must be a valid email').default('noreply@example.com'),
});

type Env = z.infer<typeof envSchema>;

let parsedEnv: Env;

try {
  parsedEnv = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const missingVars = error.issues
      .map((issue: z.ZodIssue) => `- ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(
      `❌ Invalid environment variables:\n${missingVars}\n\nPlease check your .env.local file.`
    );
  }
  throw error;
}

export const env = parsedEnv;
