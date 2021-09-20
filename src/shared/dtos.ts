import { Except, Jsonify } from 'type-fest'

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
      amountDue: number
      status: InvoiceStatus
    }>
  }
}

export type GetInvoiceDetailDTO = {
  data: {
    invoice: InvoiceDetail
  }
}

type InvoiceStatus = 'draft' | 'pending' | 'paid'

export type NewInvoiceInputDTO = Except<
  InvoiceDetail,
  'id' | 'paymentDue' | 'itemList' | 'amountDue' | 'status'
> & {
  itemList: Array<NewInvoiceItemInput>
  status: Exclude<InvoiceStatus, 'paid'>
}

type NewInvoiceItemInput = Except<InvoiceItem, 'id' | 'total'>

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

export type NewInvoiceReturnDTO = {
  data: {
    savedInvoice: InvoiceDetail
  }
}

export type UpdateInvoiceStatusInputDTO = {
  status: 'paid'
}

export type UpdateInvoiceReturnDTO = {
  data: {
    updatedInvoice: InvoiceDetail
  }
}

export type DeleteInvoiceReturnDTO = {
  data: {
    deletedInvoice: InvoiceDetail
  }
}

export type UpdateInvoiceInputDTO = NewInvoiceInputDTO
