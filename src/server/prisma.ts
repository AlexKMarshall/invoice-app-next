import { PrismaClient } from '@prisma/client'
declare global {
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient
}

const prisma = global.prisma || new PrismaClient()
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')
  global.prisma = prisma

export default prisma
