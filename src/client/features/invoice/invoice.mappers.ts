import { CreateInvoiceRequest, Stringify } from 'src/shared/dtos'
import { add, parseJSON } from 'date-fns'
import {
  generateAlphanumericId,
  generateNumericId,
} from 'src/shared/identifier'

import { InvoiceDetail } from './invoice.types'
import { PaymentTerm } from './payment-term.types'

type ReferenceDataStore = {
  paymentTerms: PaymentTerm[]
}

export function invoiceMapperFactory(referenceDataStore: ReferenceDataStore) {
  function invoiceDetailFromInput(
    input: CreateInvoiceRequest,
    id = generateAlphanumericId()
  ): InvoiceDetail {
    const paymentTerm = referenceDataStore.paymentTerms.find(
      (term) => term.id === input.paymentTermId
    )

    let paymentTermValue = 0

    if (paymentTerm) {
      paymentTermValue = paymentTerm.value
    }

    return {
      ...input,
      paymentDue: add(input.issuedAt, { days: paymentTermValue }),
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
      paymentTerm,
    }
  }

  return { invoiceDetailFromInput }
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
