import * as invoiceController from 'src/server/features/invoice/invoice.controller'
import * as z from 'zod'

import { NextApiRequest, NextApiResponse } from 'next'

import { UpdateInvoiceReturnDTO } from 'src/shared/dtos'
import { idRegex } from 'src/shared/identifier'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateInvoiceReturnDTO | { error: unknown }>
): Promise<void> {
  switch (req.method) {
    case 'PUT': {
      const { id } = queryParamsSchema.parse(req.query)
      const { code, response } = await invoiceController.updateStatus(
        id,
        req.body
      )
      res.status(code).json(response)
      return
    }
  }
}

const queryParamsSchema = z.object({
  id: z.string().regex(idRegex),
})
