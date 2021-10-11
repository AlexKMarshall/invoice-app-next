import * as invoiceModel from './invoice.model'

import {
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  DeleteInvoiceResponse,
  GetInvoiceByIdResponse,
  GetInvoicesResponse,
  GetPaymentTermsResponse,
  Stringify,
  UpdateInvoiceRequest,
  UpdateInvoiceResponse,
  UpdateInvoiceStatusRequest,
} from 'src/shared/dtos'
import {
  destringifyInvoiceInput,
  invoiceMapperFactory,
} from 'src/client/features/invoice/invoice.mappers'

import { EmptyObject } from 'src/shared/type-utils'
import { InvoiceDetail } from 'src/server/features/invoice/invoice.types'
import { parseJSON } from 'date-fns'
import { rest } from 'msw'

const { invoiceDetailFromInput } = invoiceMapperFactory(invoiceModel.store)

export const handlers = [
  rest.get<EmptyObject, GetInvoicesResponse, EmptyObject>(
    '/api/invoices',
    async (req, res, ctx) => {
      const status = req.url.searchParams.getAll('status') as
        | InvoiceDetail['status'][]
        | undefined
      const filter = status && status.length > 0 ? { status } : {}
      const invoices = await invoiceModel.findAll(filter)
      return res(ctx.status(200), ctx.json({ data: { invoices } }))
    }
  ),
  rest.get<EmptyObject, GetInvoiceByIdResponse, { id: string }>(
    '/api/invoices/:id',
    async (req, res, ctx) => {
      const invoice = await invoiceModel.findById(req.params.id)
      return res(ctx.status(200), ctx.json({ data: { invoice } }))
    }
  ),
  rest.post<
    Stringify<CreateInvoiceRequest>,
    CreateInvoiceResponse,
    EmptyObject
  >('/api/invoices', async (req, res, ctx) => {
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
  }),
  rest.delete<EmptyObject, DeleteInvoiceResponse, { id: string }>(
    '/api/invoices/:id',
    async (req, res, ctx) => {
      const { id } = req.params

      const deletedInvoice = await invoiceModel.remove(id)

      return res(
        ctx.status(200),
        ctx.json({
          data: {
            deletedInvoice,
          },
        })
      )
    }
  ),
  rest.put<UpdateInvoiceStatusRequest, UpdateInvoiceResponse, { id: string }>(
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
  rest.put<
    Stringify<UpdateInvoiceRequest>,
    UpdateInvoiceResponse,
    { id: string }
  >('/api/invoices/:id', async (req, res, ctx) => {
    const { id } = req.params
    const invoiceInput = req.body

    const oldInvoice = await invoiceModel.findById(id)
    const updatedInvoiceInput = JSON.parse(
      JSON.stringify({ ...invoiceInput, issuedAt: oldInvoice.issuedAt })
    )

    const updatedInvoice = invoiceDetailFromInput(
      destringifyInvoiceInput(updatedInvoiceInput),
      id
    )

    await invoiceModel.update(updatedInvoice)

    return res(
      ctx.status(200),
      ctx.json({
        data: {
          updatedInvoice,
        },
      })
    )
  }),
  rest.get<EmptyObject, GetPaymentTermsResponse, EmptyObject>(
    '/api/payment-terms',
    async (req, res, ctx) => {
      const paymentTerms = await invoiceModel.findAllPaymentTerms()
      return res(ctx.status(200), ctx.json({ data: { paymentTerms } }))
    }
  ),
]
