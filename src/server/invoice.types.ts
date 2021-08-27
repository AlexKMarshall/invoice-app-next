import { InvoiceStatus } from 'src/shared/dtos'

export type InvoiceSummary = {
  id: string
  paymentDue: Date
  clientName: string
  total: number
  status: InvoiceStatus
}

export type InvoiceDetail = {
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
