import * as invoiceModel from './invoice.model'

import {
  GetInvoiceDetailDTO,
  GetInvoiceSummaryDTO,
  NewInvoiceInputDTO,
  NewInvoiceReturnDTO,
  Stringify,
  UpdateInvoiceReturnDTO,
  UpdateInvoiceStatusInputDTO,
} from 'src/shared/dtos'

import { parseJSON } from 'date-fns'
import { rest } from 'msw'

type EmptyObject = Record<string, never>

export const handlers = [
  rest.get<EmptyObject, GetInvoiceSummaryDTO, EmptyObject>(
    '/api/invoices',
    async (req, res, ctx) => {
      const invoices = await invoiceModel.findAll()
      return res(ctx.status(200), ctx.json({ data: { invoices } }))
    }
  ),
  rest.get<EmptyObject, GetInvoiceDetailDTO, { id: string }>(
    '/api/invoices/:id',
    async (req, res, ctx) => {
      const invoice = await invoiceModel.findById(req.params.id)
      return res(ctx.status(200), ctx.json({ data: { invoice } }))
    }
  ),
  rest.post<Stringify<NewInvoiceInputDTO>, NewInvoiceReturnDTO, EmptyObject>(
    '/api/invoices',
    async (req, res, ctx) => {
      const newInvoice = req.body
      const savedInvoice = await invoiceModel.create({
        ...newInvoice,
        issuedAt: parseJSON(newInvoice.issuedAt),
      })
      return res(
        ctx.status(201),
        ctx.json({
          data: {
            savedInvoice,
          },
        })
      )
    }
  ),
  rest.put<UpdateInvoiceStatusInputDTO, UpdateInvoiceReturnDTO, { id: string }>(
    '/api/invoices/:id/status',
    async (req, res, ctx) => {
      const { id } = req.params
      const { status } = req.body

      const oldInvoice = await invoiceModel.findById(id)
      const updatedInvoice = { ...oldInvoice, status }
      await invoiceModel.update(updatedInvoice)

      return res(
        ctx.status(200),
        ctx.json({
          data: {
            updatedInvoice,
          },
        })
      )
    }
  ),
]
