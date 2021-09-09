import {
  InvoiceDetail,
  InvoiceSummary,
} from 'src/client/features/invoice/invoice.types'
import { NewInvoiceInputDTO, NewInvoiceReturnDTO } from 'src/shared/dtos'

import { add } from 'date-fns'
import { addInvoiceDefaults } from 'src/client/features/invoice/invoice.mappers'
import { generateId } from 'src/shared/identifier'

type Store = {
  invoices: Array<InvoiceDetail>
}

const store: Store = { invoices: [] }

export function findAll(): Promise<Array<InvoiceSummary>> {
  return Promise.resolve(store.invoices.map(invoiceDetailToSummary))
}

export function findById(id: InvoiceDetail['id']): Promise<InvoiceDetail> {
  const foundInvoice = store.invoices.find((invoice) => invoice.id === id)
  if (!foundInvoice)
    return Promise.reject(new Error(`cannot find invoice with id '${id}`))
  return Promise.resolve(foundInvoice)
}

export function save(
  invoice: NewInvoiceInputDTO
): Promise<NewInvoiceReturnDTO['data']['savedInvoice']> {
  const id = generateId()
  const invoiceWithId = addInvoiceDefaults({ ...invoice, id })
  store.invoices.push(invoiceWithId)

  return Promise.resolve(invoiceWithId)
}

export function initialise(invoices: Array<InvoiceDetail>): void {
  store.invoices = invoices
}

export function invoiceDetailToSummary(invoice: InvoiceDetail): InvoiceSummary {
  return {
    id: invoice.id,
    paymentDue: add(invoice.issuedAt, { days: invoice.paymentTerms }),
    clientName: invoice.clientName,
    total: invoice.itemList
      .map((item) => item.quantity * item.price)
      .reduce((acc, cur) => acc + cur),
    status: invoice.status,
  }
}
