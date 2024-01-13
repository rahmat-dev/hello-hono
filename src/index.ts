import { Hono } from 'hono'

const app = new Hono()

app.get('/', c => {
  return c.json({
    ok: true,
    message: 'Hello Hono!',
  })
})

export default app
