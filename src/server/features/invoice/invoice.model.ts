import * as z from 'zod'

import { ActionNotPermittedError, NotFoundError } from 'src/server/errors'
import { AsyncReturnType, IterableElement } from 'type-fest'
import { InvoiceDetail, InvoiceSummary } from './invoice.types'

import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { Prisma } from '@prisma/client'
import { add } from 'date-fns'
import { generateAlphanumericId } from 'src/shared/identifier'
import prisma from 'src/server/prisma'
import { round2dp } from 'src/shared/number'

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
    status: z.enum(['draft', 'pending', 'paid']),
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

  const amountDue = round2dp(
    invoiceItems.reduce(
      (acc, cur) => round2dp(acc + round2dp(cur.quantity * cur.item.price)),
      0
    )
  )

  return { id, paymentDue, clientName, amountDue, status }
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
    .then(invoiceDetailSchema.parse)
    .then(flattenInvoiceDetail)
}

function flattenInvoiceDetail(
  invoice: z.infer<typeof invoiceDetailSchema>
): InvoiceDetail {
  const {
    sender,
    client,
    invoiceItems,
    issuedAt,
    paymentTerms,
    ...restInvoice
  } = invoice

  const itemList = invoiceItems.map(
    ({ item: { name, price }, quantity, id }) => ({
      id,
      name,
      quantity,
      price,
      total: round2dp(price * quantity),
    })
  )

  const paymentDue = add(issuedAt, { days: paymentTerms })

  const amountDue = round2dp(
    itemList.reduce((acc, { total: itemTotal }) => round2dp(acc + itemTotal), 0)
  )

  return {
    senderAddress: sender.address,
    clientName: client.name,
    clientEmail: client.email,
    clientAddress: client.address,
    itemList,
    issuedAt,
    paymentTerms,
    paymentDue,
    amountDue,
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
          id: true,
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

const draftAddressSchema = z.object({
  street: z
    .string()
    .nullable()
    .transform((val) => val ?? ''),
  city: z
    .string()
    .nullable()
    .transform((val) => val ?? ''),
  country: z
    .string()
    .nullable()
    .transform((val) => val ?? ''),
  postcode: z
    .string()
    .nullable()
    .transform((val) => val ?? ''),
})

const draftInvoiceDetailSchema = schemaForType<DBCreateInvoiceReturn>()(
  z.object({
    id: z.string().min(1),
    status: z.literal('draft'),
    issuedAt: z.date(),
    paymentTerms: z.number(),
    projectDescription: z
      .string()
      .nullable()
      .transform((val) => val ?? ''),
    sender: z.object({
      address: draftAddressSchema,
    }),
    client: z.object({
      name: z
        .string()
        .nullable()
        .transform((val) => val ?? ''),
      email: z
        .string()
        .nullable()
        .transform((val) => val ?? ''),
      address: draftAddressSchema,
    }),
    invoiceItems: z.array(
      z.object({
        id: z.number(),
        quantity: z.number().min(1),
        item: z.object({
          name: z
            .string()
            .nullable()
            .transform((val) => val ?? ''),
          price: z.number().min(0),
        }),
      })
    ),
  })
)
const pendingInvoiceDetailSchema = schemaForType<DBCreateInvoiceReturn>()(
  z.object({
    id: z.string().min(1),
    status: z.literal('pending'),
    issuedAt: z.date(),
    paymentTerms: z.number(),
    projectDescription: z.string(),
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
        id: z.number(),
        quantity: z.number().min(1),
        item: z.object({
          name: z.string().min(1),
          price: z.number().min(0),
        }),
      })
    ),
  })
)
const paidInvoiceDetailSchema = schemaForType<DBCreateInvoiceReturn>()(
  z.object({
    id: z.string().min(1),
    status: z.literal('paid'),
    issuedAt: z.date(),
    paymentTerms: z.number(),
    projectDescription: z.string(),
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
        id: z.number(),
        quantity: z.number().min(1),
        item: z.object({
          name: z.string().min(1),
          price: z.number().min(0),
        }),
      })
    ),
  })
)

const invoiceDetailSchema = z.union([
  draftInvoiceDetailSchema,
  pendingInvoiceDetailSchema,
  paidInvoiceDetailSchema,
])

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

  const id = generateAlphanumericId()

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

function dbFindInvoiceDetail(id: InvoiceDetail['id']) {
  return prisma.invoice.findUnique({
    where: { id },
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
          id: true,
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

export function findInvoiceDetail(
  id: InvoiceDetail['id']
): Promise<InvoiceDetail> {
  return dbFindInvoiceDetail(id)
    .then((dbInvoice) => {
      if (!dbInvoice)
        return Promise.reject(
          new NotFoundError(`Cannot find invoice with id '${id}'`)
        )
      return dbInvoice
    })
    .then(invoiceDetailSchema.parse)
    .then(flattenInvoiceDetail)
}

export async function updateStatus(
  id: InvoiceDetail['id'],
  status: 'paid'
): Promise<InvoiceDetail> {
  // this should throw if invoice not found
  const invoice = await findInvoiceDetail(id)
  if (invoice.status === 'draft') {
    throw new ActionNotPermittedError(
      `cannot mark draft invoice '${id}' as paid`
    )
  }

  await prisma.invoice.updateMany({
    data: {
      status,
    },
    where: {
      id,
      status: {
        in: ['pending', 'paid'],
      },
    },
  })

  return findInvoiceDetail(id)
}

export async function remove(id: InvoiceDetail['id']): Promise<InvoiceDetail> {
  const invoice = await findInvoiceDetail(id)

  await prisma.invoice.delete({ where: { id } })

  return invoice
}
