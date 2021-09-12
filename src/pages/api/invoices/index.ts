import * as invoiceController from 'src/server/features/invoice/invoice.controller'

import { GetInvoiceSummaryDTO, NewInvoiceReturnDTO } from 'src/shared/dtos'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    GetInvoiceSummaryDTO | NewInvoiceReturnDTO | { error: unknown }
  >
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      const { code, response } = await invoiceController.getInvoiceSummaries()
      res.status(code).json(response)
      return
    }
    case 'POST': {
      const { code, response } = await invoiceController.postInvoice(req.body)
      res.status(code).json(response)
      return
    }
  }
}
