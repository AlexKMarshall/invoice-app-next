import {
  generateAlphanumericId,
  generateNumericId,
} from 'src/shared/identifier'

import { InvoiceDetail } from './invoice.types'
import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { add } from 'date-fns'

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
    amountDue: input.itemList.reduce(
      (acc, { quantity, price }) => acc + quantity * price,
      0
    ),
    id,
  }
}
