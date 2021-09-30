import { CreateInvoiceRequest, GetPaymentTermsResponse } from 'src/shared/dtos'
import {
  InvoiceDetail,
  InvoiceSummary,
} from 'src/client/features/invoice/invoice.types'

import { IterableElement } from 'type-fest'
import { add } from 'date-fns'
import { generateAlphanumericId } from 'src/shared/identifier'
import { invoiceMapperFactory } from 'src/client/features/invoice/invoice.mappers'

type PaymentTerm = IterableElement<
  GetPaymentTermsResponse['data']['paymentTerms']
>

type Store = {
  invoices: Array<InvoiceDetail>
  paymentTerms: Array<PaymentTerm>
}

export const store: Store = {
  invoices: [],
  paymentTerms: [
    { id: 1, value: 1, name: 'Net 1 Day' },
    { id: 2, value: 7, name: 'Net 7 Days' },
    { id: 3, value: 14, name: 'Net 14 Days' },
    { id: 4, value: 30, name: 'Net 30 Days' },
    { id: 5, value: 90, name: 'Net 90 Days' },
  ],
}

const { invoiceDetailFromInput } = invoiceMapperFactory(store)

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

export function create(invoice: CreateInvoiceRequest): Promise<InvoiceDetail> {
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
  let paymentTermValue = invoice.paymentTerms

  if (invoice.paymentTerm) {
    paymentTermValue = invoice.paymentTerm.value
  }
  return {
    id: invoice.id,
    paymentDue: add(invoice.issuedAt, { days: paymentTermValue }),
    clientName: invoice.clientName,
    amountDue: invoice.itemList
      .map((item) => item.quantity * item.price)
      .reduce((acc, cur) => acc + cur),
    status: invoice.status,
  }
}

export async function findAllPaymentTerms(): Promise<Array<PaymentTerm>> {
  return Promise.resolve(store.paymentTerms)
}
