import * as invoiceModel from './invoice.model'

import { GetInvoiceSummary } from 'src/shared/dtos'
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/hello', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'hello' }))
  }),
  rest.get<{}, GetInvoiceSummary, {}>(
    '/api/invoices',
    async (req, res, ctx) => {
      const invoices = await invoiceModel.findAll()
      return res(ctx.status(200), ctx.json({ data: { invoices } }))
    }
  ),
]
