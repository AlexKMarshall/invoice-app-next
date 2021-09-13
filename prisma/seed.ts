import { PrismaClient } from '@prisma/client'
import { buildMockInvoiceInput } from '../src/server/test/mocks/invoice.fixtures'
import { create } from '../src/server/features/invoice/invoice.model'
import { randomBetween } from 'src/shared/random'
const prisma = new PrismaClient()

function main() {
  console.log('seeding database...')
  const numberOfInvoices = randomBetween(0, 17)
  console.log(numberOfInvoices)

  const invoiceInputs = Array.from({ length: numberOfInvoices }, () =>
    buildMockInvoiceInput()
  )

  const savePromises = invoiceInputs.map((invoice) =>
    create(invoice).then(console.log)
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
