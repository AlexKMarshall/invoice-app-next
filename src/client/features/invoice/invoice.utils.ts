import { InvoiceDetail, InvoiceSummary } from './invoice.types'

import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { SetRequired } from 'type-fest'
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

export function addInvoiceDefaults(
  invoice: NewInvoiceInputDTO
): SetRequired<
  NewInvoiceInputDTO,
  'projectDescription' | 'clientName' | 'clientEmail'
> {
  const { projectDescription = '', clientName = '', clientEmail = '' } = invoice
  return Object.assign({}, invoice, {
    projectDescription,
    clientName,
    clientEmail,
  })
}
