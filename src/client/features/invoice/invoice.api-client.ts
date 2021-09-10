import {
  GetInvoiceDetailDTO,
  GetInvoiceSummaryDTO,
  NewInvoiceInputDTO,
  NewInvoiceReturnDTO,
  Stringify,
} from 'src/shared/dtos'
import { InvoiceDetail, InvoiceSummary } from './invoice.types'

import { parseJSON } from 'date-fns'

export async function getInvoices(): Promise<Array<InvoiceSummary>> {
  const res = await fetch('/api/invoices')
  const { data } = (await res.json()) as Stringify<GetInvoiceSummaryDTO>
  return data.invoices.map(({ paymentDue, ...invoice }) => ({
    ...invoice,
    paymentDue: parseJSON(paymentDue),
  }))
}

export async function getInvoiceDetail(
  id: InvoiceDetail['id']
): Promise<InvoiceDetail> {
  const res = await fetch(`/api/invoices/${id}`)
  const {
    data: { invoice },
  } = (await res.json()) as Stringify<GetInvoiceDetailDTO>

  return {
    ...invoice,
    issuedAt: parseJSON(invoice.issuedAt),
    paymentDue: parseJSON(invoice.paymentDue),
  }
}

export async function postInvoice(
  newInvoice: NewInvoiceInputDTO
): Promise<InvoiceDetail> {
  const res = await fetch('/api/invoices', {
    method: 'POST',
    body: JSON.stringify(newInvoice),
    headers: {
      'content-type': 'application/json',
    },
  })
  const {
    data: { savedInvoice },
  } = (await res.json()) as Stringify<NewInvoiceReturnDTO>

  return {
    ...savedInvoice,
    issuedAt: parseJSON(savedInvoice.issuedAt),
    paymentDue: parseJSON(savedInvoice.paymentDue),
  }
}
