import { PaymentTerm } from '.prisma/client'
import prisma from 'src/server/prisma'

export function findAll(): Promise<Array<PaymentTerm>> {
  return prisma.paymentTerm.findMany({
    select: { id: true, value: true, name: true },
  })
}
