import faker from 'faker'
import { generateInvoiceId } from 'src/client/shared/utils'

function randomStatus() {
  const statuses = ['draft', 'pending', 'paid'] as const
  const randomIndex = Math.floor(Math.random() * statuses.length)
  return statuses[randomIndex]
}

type InvoiceSummary = {
  id: string
  paymentDue: Date
  clientName: string
  total: number
  status: 'draft' | 'pending' | 'paid'
}

export function buildMockInvoiceSummary(): InvoiceSummary {
  return {
    id: generateInvoiceId(),
    paymentDue: faker.date.soon(),
    clientName: faker.name.findName(),
    total: faker.datatype.number(),
    status: randomStatus(),
  }
}
