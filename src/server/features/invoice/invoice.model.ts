import * as z from 'zod'

import { AsyncReturnType, IterableElement } from 'type-fest'
import { InvoiceDetail, InvoiceSummary } from './invoice.types'

import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { Prisma } from '@prisma/client'
import { add } from 'date-fns'
import { generateId } from 'src/shared/identifier'
import prisma from 'src/server/prisma'

function dbFindAllSummaries() {
  return prisma.invoice.findMany({
    select: {
      id: true,
      issuedAt: true,
      paymentTerms: true,
      client: {
        select: {
          name: true,
        },
      },
      invoiceItems: {
        select: {
          quantity: true,
          item: {
            select: {
              price: true,
            },
          },
        },
      },
      status: true,
    },
  })
}

type DbInvoiceSummary = IterableElement<
  AsyncReturnType<typeof dbFindAllSummaries>
>

function schemaForType<T>() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <S extends z.ZodType<T, any, any>>(arg: S) => arg
}

const invoiceSummaryDbSchema = schemaForType<DbInvoiceSummary>()(
  z.object({
    id: z.string(),
    issuedAt: z.date(),
    paymentTerms: z.number(),
    client: z.object({
      name: z.string(),
    }),
    invoiceItems: z.array(
      z.object({
        quantity: z.number(),
        item: z.object({
          price: z.number(),
        }),
      })
    ),
    status: z.enum(['draft', 'pending']),
  })
)

function dbSummaryToInvoiceSummary(
  invoice: z.infer<typeof invoiceSummaryDbSchema>
): InvoiceSummary {
  const {
    id,
    issuedAt,
    paymentTerms,
    client: { name: clientName },
    invoiceItems,
    status,
  } = invoice

  const paymentDue = add(issuedAt, { days: paymentTerms })

  const total = invoiceItems.reduce(
    (acc, cur) => acc + cur.quantity * cur.item.price,
    0
  )

  return { id, paymentDue, clientName, total, status }
}

export function findAll(): Promise<Array<InvoiceSummary>> {
  return dbFindAllSummaries().then((rawInvoices) =>
    rawInvoices
      .map((rawInvoice) => invoiceSummaryDbSchema.parse(rawInvoice))
      .map(dbSummaryToInvoiceSummary)
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
  street: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  postcode: z.string().min(1),
})

const createInvoiceReturnSchema = schemaForType<DBCreateInvoiceReturn>()(
  z.object({
    id: z.string().min(1),
    status: z.enum(['draft', 'pending']),
    issuedAt: z.date(),
    paymentTerms: z.number(),
    projectDescription: z
      .string()
      .nullable()
      .transform((val) => val ?? ''),
    sender: z.object({
      address: addressSchema,
    }),
    client: z.object({
      name: z.string().min(1),
      email: z.string().min(1),
      address: addressSchema,
    }),
    invoiceItems: z.array(
      z.object({
        quantity: z.number().min(1),
        item: z.object({
          name: z.string().min(1),
          price: z.number().min(0),
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

  const id = generateId()

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
