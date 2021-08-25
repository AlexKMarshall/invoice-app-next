import faker from 'faker'
import { generateInvoiceId } from 'src/client/shared/utils'

function randomStatus() {
  const statuses = ['draft', 'pending', 'paid'] as const
  const randomIndex = Math.floor(Math.random() * statuses.length)
  return statuses[randomIndex]
}

function buildMockInvoiceSummary() {
  return {
    id: generateInvoiceId(),
    paymentDue: faker.date.soon(),
    clientName: faker.name.findName(),
    total: faker.datatype.number(),
    status: randomStatus(),
  }
}

const mockInvoices = [
  buildMockInvoiceSummary(),
  buildMockInvoiceSummary(),
  buildMockInvoiceSummary(),
]

export function findAll(): Promise<typeof mockInvoices> {
  return Promise.resolve(mockInvoices)
}
