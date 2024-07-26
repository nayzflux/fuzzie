import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Server
    SERVER_URL: z.string(),

    // Database
    DATABASE_URL: z.string().url(),

    // Client
    CLIENT_URL: z.string().url(),

    // Internal webhook
    INTERNAL_WEBHOOK_SECRET: z.string(),

    // Webhook secret encryption secret key
    WEBHOOK_SECRET_SECRET: z.string(),

    // Session
    SESSION_COOKIE_SECRET: z.string(),

    // OAuth
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GITHUB_REDIRECT_URL: z.string(),

    // Email
    EMAIL_VERIFICATION_SECRET: z.string(),
    RESEND_API_KEY: z.string(),

    // Trigger
    TRIGGER_SECRET_KEY: z.string(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: Bun.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
