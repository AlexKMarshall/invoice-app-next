import { NewInvoiceInputDTO, NewInvoiceReturnDTO } from 'src/shared/dtos'

import { buildMockInvoiceSummary } from './test/mocks/invoice.fixtures'
import { generateInvoiceId } from 'src/client/shared/utils'

const mockInvoices = [
  buildMockInvoiceSummary(),
  buildMockInvoiceSummary(),
  buildMockInvoiceSummary(),
]

export function findAll(): Promise<typeof mockInvoices> {
  return Promise.resolve(mockInvoices)
}

export function create(
  newInvoice: NewInvoiceInputDTO
): Promise<NewInvoiceReturnDTO['data']['savedInvoice']> {
  const id = generateInvoiceId()

  const savedInvoice = { ...newInvoice, id }

  return Promise.resolve(savedInvoice)
}
