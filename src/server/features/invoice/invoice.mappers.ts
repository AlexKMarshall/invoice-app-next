import {
  InvoiceDetail,
  InvoiceSummary,
} from 'src/server/features/invoice/invoice.types'

import { add } from 'date-fns'

export function invoiceDetailToSummary(invoice: InvoiceDetail): InvoiceSummary {
  return {
    id: invoice.id,
    paymentDue: add(invoice.issuedAt, { days: invoice.paymentTerms }),
    clientName: invoice.clientName,
    total: invoice.itemList
      .map((item) => item.quantity * item.price)
      .reduce((acc, cur) => acc + cur),
    status: invoice.status,
  }
}

export function addPaymentDue<
  T extends { issuedAt: Date; paymentTerms: number }
>(invoiceInput: T): T & { paymentDue: Date } {
  const paymentDue = add(invoiceInput.issuedAt, {
    days: invoiceInput.paymentTerms,
  })
  return {
    ...invoiceInput,
    paymentDue,
  }
}
