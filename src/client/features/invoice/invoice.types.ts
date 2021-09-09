import { GetInvoiceSummaryDTO, NewInvoiceReturnDTO } from 'src/shared/dtos'

import { IterableElement } from 'type-fest'

export type InvoiceDetail = NewInvoiceReturnDTO['data']['savedInvoice']

export type InvoiceSummary = IterableElement<
  GetInvoiceSummaryDTO['data']['invoices']
>
