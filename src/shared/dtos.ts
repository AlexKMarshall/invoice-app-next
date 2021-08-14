import { Jsonify } from 'type-fest'

type DateStringify<T> = T extends Date
  ? string
  : T extends Array<infer U>
  ? Array<DateStringify<U>>
  : T extends Record<string, unknown>
  ? { [P in keyof T]: DateStringify<T[P]> }
  : T

export type Stringify<T> = Jsonify<DateStringify<T>>

export type GetInvoiceSummaryDTO = {
  data: {
    invoices: Array<{
      id: string
      paymentDue: Date
      clientName: string
      total: number
      status: 'draft' | 'pending' | 'paid'
    }>
  }
}

type InvoiceStatus = 'draft' | 'pending' | 'paid'

export type NewInvoiceInputDTO = {
  status: InvoiceStatus
  senderAddress: {
    street: string
    city: string
    postcode: string
    country: string
  }
  clientName: string
  clientEmail: string
  clientAddress: {
    street: string
    city: string
    postcode: string
    country: string
  }
  issuedAt: Date
  paymentTerms: number
  projectDescription: string
  itemList: Array<{ name: string; quantity: number; price: number }>
}

export type NewInvoiceReturnDTO = {
  data: {
    savedInvoice: NewInvoiceInputDTO & { id: string }
  }
}
