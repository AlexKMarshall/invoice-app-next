import { PaymentTerm } from '.prisma/client'

export function findAll(): Promise<Array<PaymentTerm>> {
  return prisma.paymentTerm.findMany({
    select: { id: true, value: true, name: true },
  })
}
