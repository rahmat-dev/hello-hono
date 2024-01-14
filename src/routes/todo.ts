import type { Todo } from '@prisma/client'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

import { zodValidator } from '~/middleware/zod-validator'
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
} from '~/services/todo'
import { CreateTodoSchema, UpdateTodoSchema } from '~/validators/todo'

type Variables = {
  todo: Todo
}

const todoRoute = new Hono<{ Variables: Variables }>()

todoRoute
  .get('/', async c => {
    const todos = await getAllTodos()

    return c.json({ ok: true, message: 'success', data: todos })
  })
  .post('/', zodValidator('json', CreateTodoSchema), async c => {
    const { task } = c.req.valid('json')
    const newTodo = await createTodo(task)

    return c.json({ ok: true, message: 'created', data: newTodo }, 201)
  })
  .use('/:id', async (c, next) => {
    const id = +c.req.param('id')
    const todo = await getTodoById(id)
    if (!todo) throw new HTTPException(404, { message: 'Todo not found' })

    c.set('todo', todo)
    await next()
  })
  .get('/:id', async c => {
    const todo = c.get('todo')
    return c.json({ ok: true, message: 'success', data: todo })
  })
  .put('/:id', zodValidator('json', UpdateTodoSchema), async c => {
    const { id } = c.get('todo')
    const data = c.req.valid('json')
    const todo = await updateTodo(data, id)

    return c.json({ ok: true, message: 'success', data: todo })
  })
  .delete('/:id', async c => {
    const { id } = c.get('todo')

    await deleteTodo(id)
    return c.json({ ok: true, message: 'success' })
  })

export default todoRoute
