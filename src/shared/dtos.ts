import { Except, Jsonify } from 'type-fest'

type DateStringify<T> = T extends Date
  ? string
  : T extends Array<infer U>
  ? Array<DateStringify<U>>
  : T extends Record<string, unknown>
  ? { [P in keyof T]: DateStringify<T[P]> }
  : T

export type Stringify<T> = Jsonify<DateStringify<T>>

export type GetInvoicesResponse = {
  data: {
    invoices: Array<{
      id: string
      paymentDue: Date
      clientName: string
      amountDue: number
      status: InvoiceStatus
    }>
  }
}

export type getInvoicesQueryParams = {
  status?: InvoiceStatus[] | InvoiceStatus
}

export type GetInvoiceByIdResponse = {
  data: {
    invoice: InvoiceDetail
  }
}

type InvoiceStatus = 'draft' | 'pending' | 'paid'

export type CreateInvoiceRequest = Except<
  InvoiceDetail,
  'id' | 'paymentDue' | 'itemList' | 'amountDue' | 'status' | 'paymentTerm'
> & {
  itemList: Array<CreateInvoiceItemRequest>
  status: Exclude<InvoiceStatus, 'paid'>
  paymentTermId?: number
}

type CreateInvoiceItemRequest = Except<InvoiceItem, 'id' | 'total'>

type InvoiceDetail = {
  id: string
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
  paymentTerm?: {
    id: number
    value: number
    name: string
  }
  paymentDue: Date
  projectDescription: string
  itemList: Array<InvoiceItem>
  amountDue: number
}

type InvoiceItem = {
  id: number
  name: string
  quantity: number
  price: number
  total: number
}

export type CreateInvoiceResponse = {
  data: {
    savedInvoice: InvoiceDetail
  }
}

export type UpdateInvoiceStatusRequest = {
  status: 'paid'
}

export type UpdateInvoiceResponse = {
  data: {
    updatedInvoice: InvoiceDetail
  }
}

export type DeleteInvoiceResponse = {
  data: {
    deletedInvoice: InvoiceDetail
  }
}

export type UpdateInvoiceRequest = CreateInvoiceRequest

export type GetPaymentTermsResponse = {
  data: {
    paymentTerms: Array<{
      id: number
      value: number
      name: string
    }>
  }
}
