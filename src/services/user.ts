import { User } from '@prisma/client'
import prisma from '~/config/db'

export const getUserByEmail = (email: string) =>
  prisma.user.findFirst({ where: { email } })

export const createUser = (data: Pick<User, 'name' | 'email' | 'password'>) =>
  prisma.user.create({ data })
