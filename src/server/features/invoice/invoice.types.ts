export type InvoiceDetail = {
  id: string
  status: 'pending' | 'draft'
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

export type InvoiceSummary = {
  id: InvoiceDetail['id']
  paymentDue: Date
  clientName: InvoiceDetail['clientName']
  total: number
  status: InvoiceDetail['status']
}
