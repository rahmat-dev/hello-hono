import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    PORT: z.coerce.number(),
    DATABASE_URL: z.string(),
    JWT_SECRET_KEY: z.string(),
  },
  runtimeEnv: Bun.env,
  emptyStringAsUndefined: true,
})
