import * as invoiceModel from '../src/server/features/invoice/invoice.model'
import * as paymentTermModel from '../src/server/features/payment-term/payment-term.model'

import { PrismaClient } from '@prisma/client'
import { invoiceFixtureFactory } from '../src/server/test/mocks/invoice.fixtures'
import { randomBetween } from 'src/shared/random'
const prisma = new PrismaClient()

async function main() {
  console.log('seeding database...')
  const numberOfInvoices = randomBetween(0, 17)
  console.log(numberOfInvoices)

  const paymentTerms = (await [
    { value: 1, name: 'Net 1 Day' },
    { value: 7, name: 'Net 7 Days' },
    { value: 14, name: 'Net 14 Days' },
    { value: 30, name: 'Net 30 Days' },
    { value: 90, name: 'Net 90 Days' },
  ].map((pt) =>
    prisma.paymentTerm.create({
      data: pt,
      select: {
        id: true,
        value: true,
        name: true,
      },
    })
  )) as any

  const { buildMockInvoiceRequest } = invoiceFixtureFactory({ paymentTerms })

  const invoiceInputs = Array.from({ length: numberOfInvoices }, () =>
    buildMockInvoiceRequest()
  )

  const savePromises = invoiceInputs.map((invoice) =>
    invoiceModel.create(invoice).then(console.log)
  )

  return Promise.all(savePromises)
}

main()
  .catch((error) => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect
  })
