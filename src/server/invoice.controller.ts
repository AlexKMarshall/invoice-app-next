import * as invoiceModel from './invoice.model'

import {
  GetInvoiceSummaryDTO,
  NewInvoiceInputDTO,
  NewInvoiceReturnDTO,
  Stringify,
} from 'src/shared/dtos'

import { parseJSON } from 'date-fns'

export async function getInvoices(): Promise<GetInvoiceSummaryDTO> {
  const invoices = await invoiceModel.findAll()
  return {
    data: {
      invoices,
    },
  }
}

export async function postInvoice(
  newInvoice: Stringify<NewInvoiceInputDTO>
): Promise<NewInvoiceReturnDTO> {
  const invoiceWithDates = {
    ...newInvoice,
    issuedAt: parseJSON(newInvoice.issuedAt),
  }

  const savedInvoice = await invoiceModel.create(invoiceWithDates)

  return {
    data: {
      savedInvoice,
    },
  }
}
