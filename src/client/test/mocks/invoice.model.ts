import {
  InvoiceDetail,
  InvoiceSummary,
} from 'src/client/features/invoice/invoice.types'

import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { add } from 'date-fns'
import { generateAlphanumericId } from 'src/shared/identifier'
import { invoiceDetailFromInput } from 'src/client/features/invoice/invoice.mappers'

type Store = {
  invoices: Array<InvoiceDetail>
}

const store: Store = { invoices: [] }

export function findAll({
  status,
}: {
  status?: InvoiceDetail['status'][]
} = {}): Promise<Array<InvoiceSummary>> {
  const invoices =
    status && status.length > 0
      ? store.invoices.filter((invoice) => status.includes(invoice.status))
      : store.invoices

  return Promise.resolve(invoices.map(invoiceDetailToSummary))
}

export function findById(id: InvoiceDetail['id']): Promise<InvoiceDetail> {
  const foundInvoice = store.invoices.find((invoice) => invoice.id === id)
  if (!foundInvoice)
    return Promise.reject(new Error(`cannot find invoice with id '${id}`))
  return Promise.resolve(foundInvoice)
}

export function create(invoice: NewInvoiceInputDTO): Promise<InvoiceDetail> {
  const invoiceWithId = invoiceDetailFromInput(
    invoice,
    generateAlphanumericId()
  )
  store.invoices.push(invoiceWithId)

  return Promise.resolve(invoiceWithId)
}

export function update(updatedInvoice: InvoiceDetail): Promise<InvoiceDetail> {
  store.invoices = store.invoices.map((invoice) =>
    invoice.id === updatedInvoice.id ? updatedInvoice : invoice
  )

  return Promise.resolve(updatedInvoice)
}

export async function remove(invoiceId: string): Promise<InvoiceDetail> {
  const deletedInvoice = await findById(invoiceId)

  store.invoices = store.invoices.filter((invoice) => invoice.id !== invoiceId)

  return Promise.resolve(deletedInvoice)
}

export function initialise(invoices: Array<InvoiceDetail>): void {
  store.invoices = invoices
}

export function invoiceDetailToSummary(invoice: InvoiceDetail): InvoiceSummary {
  return {
    id: invoice.id,
    paymentDue: add(invoice.issuedAt, { days: invoice.paymentTerms }),
    clientName: invoice.clientName,
    amountDue: invoice.itemList
      .map((item) => item.quantity * item.price)
      .reduce((acc, cur) => acc + cur),
    status: invoice.status,
  }
}
