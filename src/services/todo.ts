import { Todo } from '@prisma/client'
import prisma from '~/config/db'

export const getAllTodos = () => prisma.todo.findMany()

export const getTodoById = (id: number) =>
  prisma.todo.findFirst({ where: { id } })

export const createTodo = (task: string) =>
  prisma.todo.create({ data: { task } })

export const updateTodo = (data: Pick<Todo, 'task' | 'isDone'>, id: number) =>
  prisma.todo.update({ data, where: { id } })

export const deleteTodo = (id: number) => prisma.todo.delete({ where: { id } })
