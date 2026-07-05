import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url('NEXT_PUBLIC_SITE_URL must be a valid URL')
    .default('http://localhost:3000'),
});

type Env = z.infer<typeof envSchema>;

let parsedEnv: Env;

try {
  // eslint-disable-next-line no-undef
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
