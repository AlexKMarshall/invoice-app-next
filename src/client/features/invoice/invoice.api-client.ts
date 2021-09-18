import {
  GetInvoiceDetailDTO,
  GetInvoiceSummaryDTO,
  NewInvoiceInputDTO,
  NewInvoiceReturnDTO,
  Stringify,
  UpdateInvoiceReturnDTO,
  UpdateInvoiceStatusInputDTO,
} from 'src/shared/dtos'
import { InvoiceDetail, InvoiceSummary } from './invoice.types'

import { parseJSON } from 'date-fns'

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

export async function getInvoices(): Promise<Array<InvoiceSummary>> {
  const { data } = await client<GetInvoiceSummaryDTO>('/api/invoices')
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

function destringifyInvoiceDetail(
  invoice: Stringify<InvoiceDetail>
): InvoiceDetail {
  return {
    ...invoice,
    issuedAt: parseJSON(invoice.issuedAt),
    paymentDue: parseJSON(invoice.paymentDue),
  }
}
