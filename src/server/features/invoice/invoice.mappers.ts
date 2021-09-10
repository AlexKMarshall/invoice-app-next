import {
  InvoiceDetail,
  InvoiceSummary,
} from 'src/server/features/invoice/invoice.types'

import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { add } from 'date-fns'
import { generateId } from 'src/shared/identifier'

export function invoiceDetailToSummary(invoice: InvoiceDetail): InvoiceSummary {
  return {
    id: invoice.id,
    paymentDue: invoice.paymentDue,
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

export function invoiceDetailFromInput(
  input: NewInvoiceInputDTO,
  id = generateId()
): InvoiceDetail {
  return {
    ...input,
    paymentDue: add(input.issuedAt, { days: input.paymentTerms }),
    id,
  }
}
