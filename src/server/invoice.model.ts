import { buildMockInvoiceSummary } from './test/mocks/invoice.fixtures'

const mockInvoices = [
  buildMockInvoiceSummary(),
  buildMockInvoiceSummary(),
  buildMockInvoiceSummary(),
]

export function findAll(): Promise<typeof mockInvoices> {
  return Promise.resolve(mockInvoices)
}
