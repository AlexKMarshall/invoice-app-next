import { Jsonify } from 'type-fest'

type DateStringify<T> = T extends Date
  ? string
  : T extends Array<infer U>
  ? Array<DateStringify<U>>
  : T extends object
  ? { [P in keyof T]: DateStringify<T[P]> }
  : T

export type ResponseStringify<T> = Jsonify<DateStringify<T>>

export type GetInvoiceSummary = {
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
