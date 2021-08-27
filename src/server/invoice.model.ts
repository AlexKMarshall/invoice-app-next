import * as z from 'zod'

import { AsyncReturnType, IterableElement } from 'type-fest'

import { InvoiceDetail } from 'src/client/features/invoice/invoice.types'
import { InvoiceSummary } from './invoice.types'
import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { Prisma } from '@prisma/client'
import { generateInvoiceId } from 'src/client/shared/utils'
import prisma from 'src/server/prisma'

function dbFindAll() {
  return prisma.invoiceSummary.findMany()
}

type DBInvoiceSummary = IterableElement<AsyncReturnType<typeof dbFindAll>>

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
  return dbFindAll().then((rawInvoices) =>
    rawInvoices.map((rawInvoice) => invoiceSummarySchema.parse(rawInvoice))
  )
}

export function create(newInvoice: NewInvoiceInputDTO): Promise<InvoiceDetail> {
  const invoiceToSave = prepareInvoiceForCreate(newInvoice)

  return dbCreate(invoiceToSave)
    .then(createInvoiceReturnSchema.parse)
    .then(flattenInvoiceDetail)
}

function flattenInvoiceDetail(
  invoice: z.infer<typeof createInvoiceReturnSchema>
): InvoiceDetail {
  const { sender, client, invoiceItems, ...restInvoice } = invoice

  const itemList = invoiceItems.map(({ item: { name, price }, quantity }) => ({
    name,
    quantity,
    price,
  }))

  return {
    senderAddress: sender.address,
    clientName: client.name,
    clientEmail: client.email,
    clientAddress: client.address,
    itemList,
    ...restInvoice,
  }
}

function dbCreate(invoice: Prisma.InvoiceCreateInput) {
  return prisma.invoice.create({
    data: invoice,
    select: {
      id: true,
      status: true,
      issuedAt: true,
      paymentTerms: true,
      projectDescription: true,
      sender: {
        select: {
          address: {
            select: {
              street: true,
              city: true,
              country: true,
              postcode: true,
            },
          },
        },
      },
      client: {
        select: {
          name: true,
          email: true,
          address: {
            select: {
              street: true,
              city: true,
              country: true,
              postcode: true,
            },
          },
        },
      },
      invoiceItems: {
        select: {
          quantity: true,
          item: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      },
    },
  })
}

type DBCreateInvoiceReturn = AsyncReturnType<typeof dbCreate>

const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  country: z.string(),
  postcode: z.string(),
})

const createInvoiceReturnSchema = schemaForType<DBCreateInvoiceReturn>()(
  z.object({
    id: z.string(),
    status: z.enum(['draft', 'pending', 'paid']),
    issuedAt: z.date(),
    paymentTerms: z.number(),
    projectDescription: z.string(),
    sender: z.object({
      address: addressSchema,
    }),
    client: z.object({
      name: z.string(),
      email: z.string(),
      address: addressSchema,
    }),
    invoiceItems: z.array(
      z.object({
        quantity: z.number(),
        item: z.object({
          name: z.string(),
          price: z.number(),
        }),
      })
    ),
  })
)

function prepareInvoiceForCreate(
  newInvoice: NewInvoiceInputDTO
): Prisma.InvoiceCreateInput {
  const {
    clientName,
    clientEmail,
    clientAddress,
    senderAddress,
    itemList,
    ...restInvoice
  } = newInvoice

  const id = generateInvoiceId()

  const sender: Prisma.SenderCreateNestedOneWithoutInvoiceInput = {
    create: {
      address: {
        create: senderAddress,
      },
    },
  }

  const client: Prisma.ClientCreateNestedOneWithoutInvoiceInput = {
    create: {
      name: clientName,
      email: clientEmail,
      address: {
        create: clientAddress,
      },
    },
  }

  const invoiceItems: Prisma.InvoiceItemCreateNestedManyWithoutInvoiceInput = {
    create: itemList.map((itemInput) => ({
      quantity: itemInput.quantity,
      item: {
        create: {
          name: itemInput.name,
          price: itemInput.price,
        },
      },
    })),
  }

  const invoiceToSave = {
    id,
    sender,
    client,
    invoiceItems,
    ...restInvoice,
  }

  return invoiceToSave
}
