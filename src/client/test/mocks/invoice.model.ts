import {
  GetInvoiceSummaryDTO,
  NewInvoiceInputDTO,
  NewInvoiceReturnDTO,
} from 'src/shared/dtos'

import { InvoiceDetail } from 'src/client/features/invoice/invoice.types'
import { IterableElement } from 'msw/node_modules/type-fest'
import { add } from 'date-fns'
import { generateId } from 'src/shared/identifier'

type InvoiceSummary = IterableElement<GetInvoiceSummaryDTO['data']['invoices']>

type Store = {
  invoices: Array<InvoiceDetail>
}

const store: Store = { invoices: [] }

export function findAll(): Promise<Array<InvoiceSummary>> {
  return Promise.resolve(store.invoices.map(invoiceDetailToSummary))
}

export function save(
  invoice: NewInvoiceInputDTO
): Promise<NewInvoiceReturnDTO['data']['savedInvoice']> {
  const id = generateId()
  const invoiceWithId = { ...invoice, id }
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
