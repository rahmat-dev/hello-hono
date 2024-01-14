/* https://github.com/honojs/middleware/blob/main/packages/zod-validator/src/index.ts */
import type {
  Context,
  Env,
  MiddlewareHandler,
  TypedResponse,
  ValidationTargets,
} from 'hono'
import { validator } from 'hono/validator'
import type { ZodError, ZodSchema, z } from 'zod'

export type Hook<T, E extends Env, P extends string, O = {}> = (
  result:
    | { success: true; data: T }
    | { success: false; error: ZodError; data: T },
  c: Context<E, P>,
) =>
  | Response
  | Promise<Response>
  | void
  | Promise<Response | void>
  | TypedResponse<O>

type HasUndefined<T> = undefined extends T ? true : false

export const zodValidator = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets,
  E extends Env,
  P extends string,
  I = z.input<T>,
  O = z.output<T>,
  V extends {
    in: HasUndefined<I> extends true
      ? { [K in Target]?: I }
      : { [K in Target]: I }
    out: { [K in Target]: O }
  } = {
    in: HasUndefined<I> extends true
      ? { [K in Target]?: I }
      : { [K in Target]: I }
    out: { [K in Target]: O }
  },
>(
  target: Target,
  schema: T,
  hook?: Hook<z.infer<T>, E, P>,
): MiddlewareHandler<E, P, V> =>
  validator(target, async (value, c) => {
    const result = await schema.safeParseAsync(value)

    if (hook) {
      const hookResult = hook({ data: value, ...result }, c)
      if (hookResult) {
        if (hookResult instanceof Response || hookResult instanceof Promise) {
          return hookResult
        }
        if ('response' in hookResult) {
          return hookResult.response
        }
      }
    }

    if (!result.success) {
      const { fieldErrors } = result.error.flatten()
      let errors = {}

      Object.keys(fieldErrors).forEach(key => {
        // @ts-ignore
        errors[key] = fieldErrors[key][0]
      })

      return c.json(
        {
          ok: false,
          message: 'Validation errors',
          errors,
        },
        400,
      )
    }

    const data = result.data as z.infer<T>
    return data
  })
