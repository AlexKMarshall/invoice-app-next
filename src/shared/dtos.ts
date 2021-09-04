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
      status: InvoiceStatus
    }>
  }
}

type InvoiceStatus = 'draft' | 'pending'

export type NewDraftInvoiceInputDTO = {
  status: 'draft'
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
  projectDescription?: string
  itemList: Array<{ name: string; quantity: number; price: number }>
}

export type NewPendingInvoiceInputDTO = {
  status: 'pending'
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

export type NewInvoiceInputDTO =
  | NewDraftInvoiceInputDTO
  | NewPendingInvoiceInputDTO

type DraftInvoiceDetail = {
  id: string
  status: 'draft'
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
  projectDescription?: string
  itemList: Array<{ name: string; quantity: number; price: number }>
}

type PendingInvoiceDetail = {
  id: string
  status: 'pending'
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
    savedInvoice: DraftInvoiceDetail | PendingInvoiceDetail
  }
}
