import {
  DeleteInvoiceReturnDTO,
  GetInvoiceDetailDTO,
  GetInvoiceSummaryDTO,
  GetInvoiceSummaryQueryParams,
  NewInvoiceInputDTO,
  NewInvoiceReturnDTO,
  Stringify,
  UpdateInvoiceInputDTO,
  UpdateInvoiceReturnDTO,
  UpdateInvoiceStatusInputDTO,
} from 'src/shared/dtos'
import { InvoiceDetail, InvoiceSummary } from './invoice.types'

import { destringifyInvoiceDetail } from './invoice.mappers'
import { parseJSON } from 'date-fns'
import { toArray } from 'src/shared/array'

type EmptyObject = Record<string, never>
type ClientOptions<TData> = RequestInit & {
  data?: TData
}

async function client<TResponse, TBody = EmptyObject>(
  endpoint: string,
  { data, headers: customHeaders, ...customOptions }: ClientOptions<TBody> = {}
): Promise<Stringify<TResponse>> {
  const requestOptions: RequestInit = {}
  const requestHeaders: HeadersInit = {}

  if (data) {
    Object.assign(requestOptions, {
      body: JSON.stringify(data),
      method: 'POST',
    })
    Object.assign(requestHeaders, { 'content-type': 'application/json' })
  }

  Object.assign(requestHeaders, customHeaders)
  Object.assign(requestOptions, { headers: requestHeaders }, customOptions)

  const res = await fetch(endpoint, requestOptions)
  const responseData: Stringify<TResponse> = await res.json()
  return responseData
}

export async function getInvoices(
  filter?: GetInvoiceSummaryQueryParams
): Promise<Array<InvoiceSummary>> {
  const searchParams = new URLSearchParams()

  if (filter?.status) {
    const statuses = toArray(filter.status)
    statuses.forEach((status) => {
      searchParams.append('status', status)
    })
  }

  const { data } = await client<GetInvoiceSummaryDTO>(
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
  } = await client<GetInvoiceDetailDTO>(`/api/invoices/${id}`)

  return {
    ...invoice,
    issuedAt: parseJSON(invoice.issuedAt),
    paymentDue: parseJSON(invoice.paymentDue),
  }
}

export async function postInvoice(
  newInvoice: NewInvoiceInputDTO
): Promise<InvoiceDetail> {
  const {
    data: { savedInvoice },
  } = await client<NewInvoiceReturnDTO, NewInvoiceInputDTO>('/api/invoices', {
    data: newInvoice,
  })
  return destringifyInvoiceDetail(savedInvoice)
}

export async function updateStatus(
  invoiceId: InvoiceDetail['id'],
  status: 'paid'
): Promise<InvoiceDetail> {
  const {
    data: { updatedInvoice },
  } = await client<UpdateInvoiceReturnDTO, UpdateInvoiceStatusInputDTO>(
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
  invoice: UpdateInvoiceInputDTO
): Promise<InvoiceDetail> {
  const {
    data: { updatedInvoice },
  } = await client<UpdateInvoiceReturnDTO, UpdateInvoiceInputDTO>(
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
  } = await client<DeleteInvoiceReturnDTO>(`/api/invoices/${invoiceId}`, {
    method: 'DELETE',
  })

  return destringifyInvoiceDetail(deletedInvoice)
}
