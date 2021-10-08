import {
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  DeleteInvoiceResponse,
  GetInvoiceByIdResponse,
  GetInvoicesResponse,
  UpdateInvoiceRequest,
  UpdateInvoiceResponse,
  UpdateInvoiceStatusRequest,
  getInvoicesQueryParams,
} from 'src/shared/dtos'
import { InvoiceDetail, InvoiceSummary } from './invoice.types'

import { client } from 'src/client/shared/api-client'
import { destringifyInvoiceDetail } from './invoice.mappers'
import { parseJSON } from 'date-fns'
import { toArray } from 'src/shared/array'

export async function getInvoices(
  filter?: getInvoicesQueryParams
): Promise<Array<InvoiceSummary>> {
  const searchParams = new URLSearchParams()

  if (filter?.status) {
    const statuses = toArray(filter.status)
    statuses.forEach((status) => {
      searchParams.append('status', status)
    })
  }

  const { data } = await client<GetInvoicesResponse>(
    `/api/invoices?${searchParams}`
  )

  return data.invoices.map(({ paymentDue, ...invoice }) => ({
    ...invoice,
    paymentDue: parseJSON(paymentDue),
  }))
}

export async function getInvoiceDetail(
  id: InvoiceDetail['id']
): Promise<InvoiceDetail> {
  const {
    data: { invoice },
  } = await client<GetInvoiceByIdResponse>(`/api/invoices/${id}`)

  return {
    ...invoice,
    issuedAt: parseJSON(invoice.issuedAt),
    paymentDue: parseJSON(invoice.paymentDue),
  }
}

export async function postInvoice(
  newInvoice: CreateInvoiceRequest
): Promise<InvoiceDetail> {
  const {
    data: { savedInvoice },
  } = await client<CreateInvoiceResponse, CreateInvoiceRequest>(
    '/api/invoices',
    {
      data: newInvoice,
    }
  )
  return destringifyInvoiceDetail(savedInvoice)
}

export async function updateStatus(
  invoiceId: InvoiceDetail['id'],
  status: 'paid'
): Promise<InvoiceDetail> {
  const {
    data: { updatedInvoice },
  } = await client<UpdateInvoiceResponse, UpdateInvoiceStatusRequest>(
    `/api/invoices/${invoiceId}/status`,
    {
      data: { status },
      method: 'PUT',
    }
  )

  return destringifyInvoiceDetail(updatedInvoice)
}

export async function updateInvoice(
  invoiceId: InvoiceDetail['id'],
  invoice: UpdateInvoiceRequest
): Promise<InvoiceDetail> {
  const {
    data: { updatedInvoice },
  } = await client<UpdateInvoiceResponse, UpdateInvoiceRequest>(
    `/api/invoices/${invoiceId}`,
    {
      data: invoice,
      method: 'PUT',
    }
  )

  return destringifyInvoiceDetail(updatedInvoice)
}

export async function deleteInvoice(
  invoiceId: InvoiceDetail['id']
): Promise<InvoiceDetail> {
  const {
    data: { deletedInvoice },
  } = await client<DeleteInvoiceResponse>(`/api/invoices/${invoiceId}`, {
    method: 'DELETE',
  })

  return destringifyInvoiceDetail(deletedInvoice)
}
