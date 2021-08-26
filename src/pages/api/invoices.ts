import * as invoiceController from 'src/server/invoice.controller'

import { GetInvoiceSummaryDTO, NewInvoiceReturnDTO } from 'src/shared/dtos'
import { NextApiRequest, NextApiResponse } from 'next'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// import prisma from 'src/server/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetInvoiceSummaryDTO | NewInvoiceReturnDTO>
): Promise<void> {
  switch (req.method) {
    case 'GET':
      res.status(200).json(await invoiceController.getInvoices())
      return
    case 'POST':
      res.status(201).json(await invoiceController.postInvoice(req.body))
      return
    default:
      return
  }
}
