import { CreateInvoiceResponse, GetInvoicesResponse } from 'src/shared/dtos'

import { IterableElement } from 'type-fest'

export type InvoiceDetail = CreateInvoiceResponse['data']['savedInvoice']

export type InvoiceSummary = IterableElement<
  GetInvoicesResponse['data']['invoices']
>

export type Address = {
  street: string
  city: string
  postcode: string
  country: string
}
