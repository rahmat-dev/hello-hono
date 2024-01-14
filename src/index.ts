import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'

import { env } from '~/config/env'
import todoRoute from '~/routes/todo'

const app = new Hono()

app.use(
  '*',
  logger(),
  basicAuth({ username: env.ADMIN_USERNAME, password: env.ADMIN_PASSWORD }),
)

app.get('/', c => {
  return c.json({ ok: true, message: 'Hello Hono!' })
})

app.route('/todos', todoRoute)

app.notFound(c => {
  return c.json({ ok: false, message: 'Not Found' }, 404)
})

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ ok: false, message: err.message }, err.status)
  }

  return c.json({ ok: false, message: err.message }, 500)
})

export default app
