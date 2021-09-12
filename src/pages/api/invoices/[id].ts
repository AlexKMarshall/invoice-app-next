import * as invoiceController from 'src/server/features/invoice/invoice.controller'
import * as z from 'zod'

import { NextApiRequest, NextApiResponse } from 'next'

import { GetInvoiceDetailDTO } from 'src/shared/dtos'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetInvoiceDetailDTO | { error: unknown }>
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      const { id } = queryParamsSchema.parse(req.query)
      const { code, response } = await invoiceController.getInvoiceDetail(id)
      res.status(code).json(response)
      return
    }
  }
}

const queryParamsSchema = z.object({
  id: z.string().min(1),
})
