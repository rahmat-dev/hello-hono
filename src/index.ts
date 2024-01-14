import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

import todoRoute from '~/routes/todo'

const app = new Hono()

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
