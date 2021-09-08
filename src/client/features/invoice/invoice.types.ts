import { NewInvoiceReturnDTO } from 'src/shared/dtos'

export type InvoiceDetail = NewInvoiceReturnDTO['data']['savedInvoice']

export type InvoiceSummary = {
  id: InvoiceDetail['id']
  paymentDue: Date
  clientName: InvoiceDetail['clientName']
  total: number
  status: InvoiceDetail['status']
}
