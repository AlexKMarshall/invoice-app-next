import * as invoiceController from 'src/server/features/invoice/invoice.controller'
import * as z from 'zod'

import {
  DeleteInvoiceReturnDTO,
  GetInvoiceDetailDTO,
  UpdateInvoiceReturnDTO,
} from 'src/shared/dtos'
import { NextApiRequest, NextApiResponse } from 'next'

import { idRegex } from 'src/shared/identifier'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | GetInvoiceDetailDTO
    | UpdateInvoiceReturnDTO
    | DeleteInvoiceReturnDTO
    | { error: unknown }
  >
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      const { id } = queryParamsSchema.parse(req.query)
      const { code, response } = await invoiceController.getInvoiceDetail(id)
      res.status(code).json(response)
      return
    }
    case 'PUT': {
      const { id } = queryParamsSchema.parse(req.query)
      const { code, response } = await invoiceController.updateInvoice(
        id,
        req.body
      )
      res.status(code).json(response)
      return
    }
    case 'DELETE': {
      const { id } = queryParamsSchema.parse(req.query)
      const { code, response } = await invoiceController.deleteInvoice(id)
      res.status(code).json(response)
      return
    }
  }
}

const queryParamsSchema = z.object({
  id: z
    .string()
    .regex(new RegExp(idRegex, 'i')) // we don't care about casing in the url
    .transform((id) => id.toLowerCase()), // however in database it's stored as lowercase
})
