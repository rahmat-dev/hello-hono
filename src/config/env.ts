import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    PORT: z.coerce.number(),
    DATABASE_URL: z.string(),
    ADMIN_USERNAME: z.string(),
    ADMIN_PASSWORD: z.string(),
  },
  runtimeEnv: Bun.env,
  emptyStringAsUndefined: true,
})
