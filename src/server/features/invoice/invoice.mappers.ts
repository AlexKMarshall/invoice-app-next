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
import { round2dp } from 'src/shared/number'

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
      total: itemInput.quantity * itemInput.price,
    })),
    amountDue: round2dp(
      input.itemList.reduce(
        (acc, { quantity, price }) =>
          round2dp(acc + round2dp(quantity * price)),
        0
      )
    ),
  }
}
