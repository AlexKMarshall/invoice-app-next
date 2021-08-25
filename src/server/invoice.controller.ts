import * as invoiceModel from './invoice.model'

import { GetInvoiceSummaryDTO } from 'src/shared/dtos'

export async function getInvoices(): Promise<GetInvoiceSummaryDTO> {
  const invoices = await invoiceModel.findAll()
  return {
    data: {
      invoices,
    },
  }
}
