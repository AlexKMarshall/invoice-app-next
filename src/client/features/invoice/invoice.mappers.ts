import { InvoiceDetail, InvoiceSummary } from './invoice.types'

import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { add } from 'date-fns'

export function invoiceDetailToSummary(invoice: InvoiceDetail): InvoiceSummary {
  return {
    id: invoice.id,
    paymentDue: add(invoice.issuedAt, { days: invoice.paymentTerms }),
    clientName: invoice.clientName,
    total: invoice.itemList
      .map((item) => item.quantity * item.price)
      .reduce((acc, cur) => acc + cur, 0),
    status: invoice.status,
  }
}

const defaultAddressValues = {
  street: '',
  city: '',
  postcode: '',
  country: '',
}

const defaultInvoiceValues = {
  projectDescription: '',
  clientName: '',
  clientEmail: '',
  senderAddress: defaultAddressValues,
  clientAddress: defaultAddressValues,
}

export function addInvoiceDefaults(
  invoice: NewInvoiceInputDTO & { id: string }
): InvoiceDetail {
  return {
    ...defaultInvoiceValues,
    ...invoice,
    senderAddress: {
      ...defaultInvoiceValues.senderAddress,
      ...invoice.senderAddress,
    },
    clientAddress: {
      ...defaultInvoiceValues.clientAddress,
      ...invoice.clientAddress,
    },
    paymentDue: add(invoice.issuedAt, { days: invoice.paymentTerms }),
  }
}
