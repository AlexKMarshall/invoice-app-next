import * as z from 'zod'

import { AsyncReturnType, IterableElement } from 'type-fest'

import { InvoiceDetail } from 'src/client/features/invoice/invoice.types'
import { InvoiceSummary } from './invoice.types'
import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { generateInvoiceId } from 'src/client/shared/utils'
import prisma from 'src/server/prisma'

function findAllDb() {
  return prisma.invoiceSummary.findMany()
}

type DBInvoiceSummary = IterableElement<AsyncReturnType<typeof findAllDb>>

function schemaForType<T>() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <S extends z.ZodType<T, any, any>>(arg: S) => arg
}

const invoiceSummarySchema = schemaForType<DBInvoiceSummary>()(
  z.object({
    id: z.string(),
    paymentDue: z.date(),
    clientName: z.string(),
    total: z.number(),
    status: z.enum(['draft', 'pending', 'paid']),
  })
)

export function findAll(): Promise<Array<InvoiceSummary>> {
  return findAllDb().then((rawInvoices) =>
    rawInvoices.map((rawInvoice) => invoiceSummarySchema.parse(rawInvoice))
  )
}

export function create(newInvoice: NewInvoiceInputDTO): Promise<InvoiceDetail> {
  const id = generateInvoiceId()

  const savedInvoice = { ...newInvoice, id }

  return Promise.resolve(savedInvoice)
}
