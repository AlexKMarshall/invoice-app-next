import { CreateInvoiceResponse, GetInvoicesResponse } from 'src/shared/dtos'

import { IterableElement } from 'type-fest'

export type InvoiceDetail = CreateInvoiceResponse['data']['savedInvoice']
export type InvoiceSummary = IterableElement<
  GetInvoicesResponse['data']['invoices']
>
