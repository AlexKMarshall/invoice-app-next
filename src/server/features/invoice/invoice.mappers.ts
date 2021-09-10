import {
  InvoiceDetail,
  InvoiceSummary,
} from 'src/server/features/invoice/invoice.types'
import {
  generateAlphanumericId,
  generateNumericId,
} from 'src/shared/identifier'

import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { add } from 'date-fns'

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
  invoiceId = generateAlphanumericId()
): InvoiceDetail {
  return {
    ...input,
    paymentDue: add(input.issuedAt, { days: input.paymentTerms }),
    id: invoiceId,
    itemList: input.itemList.map((itemInput) => ({
      ...itemInput,
      id: generateNumericId(),
    })),
  }
}
