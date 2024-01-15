import { Todo } from '@prisma/client'
import prisma from '~/config/db'

export const getAllTodos = () => prisma.todo.findMany()

export const getTodosByUserId = (userId: number) =>
  prisma.todo.findMany({ where: { userId } })

export const getTodoById = (id: number) =>
  prisma.todo.findFirst({ where: { id } })

export const getTodoByIdAndUserId = (id: number, userId: number) =>
  prisma.todo.findFirst({ where: { id, userId } })

export const createTodo = (data: Pick<Todo, 'task' | 'userId'>) =>
  prisma.todo.create({ data })

export const updateTodo = (data: Pick<Todo, 'task' | 'isDone'>, id: number) =>
  prisma.todo.update({ data, where: { id } })

export const deleteTodo = (id: number) => prisma.todo.delete({ where: { id } })
