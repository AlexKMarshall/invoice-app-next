import { InvoiceDetail, InvoiceSummary } from './invoice.types'
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
      .reduce((acc, cur) => acc + cur, 0),
    status: invoice.status,
  }
}

export function invoiceDetailFromInput(
  input: NewInvoiceInputDTO,
  id = generateAlphanumericId()
): InvoiceDetail {
  return {
    ...input,
    paymentDue: add(input.issuedAt, { days: input.paymentTerms }),
    itemList: input.itemList.map((itemInput) => ({
      ...itemInput,
      id: generateNumericId(),
      total: itemInput.quantity * itemInput.price,
    })),
    id,
  }
}
