import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { sign } from 'hono/jwt'

import { env } from '~/config/env'
import { zodValidator } from '~/middleware/zod-validator'
import { createUser, getUserByEmail } from '~/services/user'
import { getJwtExpiredTime } from '~/utils/time'
import { LoginSchema, RegisterSchema } from '~/validators/auth'

type Payload = {
  sub: number
  name: string
  exp: number
}

const authRoute = new Hono()

authRoute
  .post('/login', zodValidator('json', LoginSchema), async c => {
    const { email, password } = c.req.valid('json')
    const user = await getUserByEmail(email)

    if (!user)
      throw new HTTPException(400, { message: 'Invalid email or password' })

    const isMatch = await Bun.password.verify(password, user.password)
    if (!isMatch)
      throw new HTTPException(400, { message: 'Invalid email or password' })

    const payload: Payload = {
      sub: user.id,
      name: user.name,
      exp: getJwtExpiredTime(),
    }
    const token = await sign(payload, env.JWT_SECRET_KEY)
    return c.json({
      ok: true,
      message: 'success',
      data: { user: { id: user.id, name: user.name }, token },
    })
  })
  .post('/register', zodValidator('json', RegisterSchema), async c => {
    const { name, email, password } = c.req.valid('json')
    const user = await getUserByEmail(email)

    if (user) throw new HTTPException(400, { message: 'Email has registered' })

    const hashedPassword = await Bun.password.hash(password)
    const newUser = await createUser({ name, email, password: hashedPassword })

    const payload: Payload = { sub: newUser.id, name, exp: getJwtExpiredTime() }
    const token = await sign(payload, env.JWT_SECRET_KEY)
    return c.json({
      ok: true,
      message: 'success',
      data: { user: { id: newUser.id, name: newUser.name }, token },
    })
  })

export default authRoute
