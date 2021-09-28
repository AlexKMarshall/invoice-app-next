import { CreateInvoiceRequest, Stringify } from 'src/shared/dtos'
import { add, parseJSON } from 'date-fns'
import {
  generateAlphanumericId,
  generateNumericId,
} from 'src/shared/identifier'

import { InvoiceDetail } from './invoice.types'

export function invoiceDetailFromInput(
  input: CreateInvoiceRequest,
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
    amountDue: input.itemList.reduce(
      (acc, { quantity, price }) => acc + quantity * price,
      0
    ),
    id,
  }
}

export function destringifyInvoiceDetail(
  invoice: Stringify<InvoiceDetail>
): InvoiceDetail {
  return {
    ...invoice,
    issuedAt: parseJSON(invoice.issuedAt),
    paymentDue: parseJSON(invoice.paymentDue),
  }
}

export function destringifyInvoiceInput(
  invoiceInput: Stringify<CreateInvoiceRequest>
): CreateInvoiceRequest {
  return { ...invoiceInput, issuedAt: parseJSON(invoiceInput.issuedAt) }
}
