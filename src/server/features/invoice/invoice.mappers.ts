import {
  InvoiceDetail,
  InvoiceSummary,
} from 'src/server/features/invoice/invoice.types'

export function invoiceDetailToSummary({
  id,
  paymentDue,
  clientName,
  amountDue,
  status,
}: InvoiceDetail): InvoiceSummary {
  return {
    id,
    paymentDue,
    clientName,
    amountDue,
    status,
  }
}
