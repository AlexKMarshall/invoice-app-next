import * as invoiceModel from './invoice.model'

import {
  GetInvoiceSummaryDTO,
  NewInvoiceInputDTO,
  NewInvoiceReturnDTO,
  Stringify,
} from 'src/shared/dtos'

import { parseJSON } from 'date-fns'
import { rest } from 'msw'

type EmptyObject = Record<string, never>

export const handlers = [
  rest.get('/api/hello', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'hello' }))
  }),
  rest.get<EmptyObject, GetInvoiceSummaryDTO, EmptyObject>(
    '/api/invoices',
    async (req, res, ctx) => {
      const invoices = await invoiceModel.findAll()
      return res(ctx.status(200), ctx.json({ data: { invoices } }))
    }
  ),
  rest.post<Stringify<NewInvoiceInputDTO>, NewInvoiceReturnDTO, EmptyObject>(
    '/api/invoices',
    async (req, res, ctx) => {
      const newInvoice = req.body
      const savedInvoice = await invoiceModel.save({
        ...newInvoice,
        issuedAt: parseJSON(newInvoice.issuedAt),
      })
      return res(
        ctx.status(200),
        ctx.json({
          data: {
            savedInvoice,
          },
        })
      )
    }
  ),
]
