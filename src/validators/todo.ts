import { z } from 'zod'

export const CreateTodoSchema = z.object({
  task: z.string({ required_error: 'Task is required' }),
})

export const FindTodoByIdSchema = z.object({
  id: z.coerce.number(),
})

export const UpdateTodoSchema = z.object({
  task: z.string({ required_error: 'Task is required' }),
  isDone: z.boolean({ required_error: 'Status is required' }),
})
