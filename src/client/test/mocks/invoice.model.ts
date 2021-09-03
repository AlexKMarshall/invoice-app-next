import { GetInvoiceSummaryDTO, NewInvoiceReturnDTO } from 'src/shared/dtos'

import { IterableElement } from 'msw/node_modules/type-fest'
import { add } from 'date-fns'
import { generateId } from 'src/client/shared/identifier'

type InvoiceSummary = IterableElement<GetInvoiceSummaryDTO['data']['invoices']>
type InvoiceDetail = NewInvoiceReturnDTO['data']['savedInvoice']

type Store = {
  invoices: Array<InvoiceSummary>
  invoiceDetails: Array<InvoiceDetail>
}

const store: Store = { invoices: [], invoiceDetails: [] }

export function findAll(): Promise<Array<InvoiceSummary>> {
  return Promise.resolve(store.invoiceDetails.map(invoiceDetailToSummary))
}

export function save(
  invoice: Omit<InvoiceDetail, 'id'>
): Promise<InvoiceDetail> {
  const id = generateId()
  const invoiceWithId = { ...invoice, id }
  store.invoiceDetails.push(invoiceWithId)
  return Promise.resolve(invoiceWithId)
}

export function initialise(invoices: Array<InvoiceDetail>): void {
  store.invoiceDetails = invoices
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
