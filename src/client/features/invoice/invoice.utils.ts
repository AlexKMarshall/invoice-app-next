import { InvoiceDetail, InvoiceSummary } from './invoice.types'
import { Merge, PartialDeep, SetRequired } from 'type-fest'

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
  const senderAddress = {
    ...defaultInvoiceValues.senderAddress,
    ...invoice.senderAddress,
  }
  const clientAddress = {
    ...defaultInvoiceValues.clientAddress,
    ...invoice.clientAddress,
  }

  const { projectDescription = '', clientName = '', clientEmail = '' } = invoice
  return Object.assign({}, invoice, {
    projectDescription,
    clientName,
    clientEmail,
    senderAddress,
    clientAddress,
  })
}
