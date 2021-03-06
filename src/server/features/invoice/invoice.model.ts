import * as z from 'zod'

import { ActionNotPermittedError, NotFoundError } from 'src/server/errors'
import { AsyncReturnType, IterableElement } from 'type-fest'
import { CreateInvoiceRequest, UpdateInvoiceRequest } from 'src/shared/dtos'
import { InvoiceDetail, InvoiceSummary } from './invoice.types'

import { Prisma } from '@prisma/client'
import { add } from 'date-fns'
import { generateAlphanumericId } from 'src/shared/identifier'
import prisma from 'src/server/prisma'
import { round2dp } from 'src/shared/number'

function dbFindAllSummaries(where?: Prisma.InvoiceWhereInput) {
  return prisma.invoice.findMany({
    select: {
      id: true,
      issuedAt: true,
      paymentTerm: {
        select: {
          value: true,
        },
      },
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
    where,
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
    paymentTerm: z.object({
      value: z.number(),
    }),
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
    paymentTerm,
    client: { name: clientName },
    invoiceItems,
    status,
  } = invoice

  let paymentTermValue = 0
  if (paymentTerm) {
    paymentTermValue = paymentTerm.value
  }

  const paymentDue = add(issuedAt, { days: paymentTermValue })

  const amountDue = round2dp(
    invoiceItems.reduce(
      (acc, cur) => round2dp(acc + round2dp(cur.quantity * cur.item.price)),
      0
    )
  )

  return { id, paymentDue, clientName, amountDue, status }
}

export function findAll({ status }: { status?: InvoiceStatus[] } = {}): Promise<
  Array<InvoiceSummary>
> {
  const where = status ? { status: { in: status } } : {}

  return dbFindAllSummaries(where).then((rawInvoices) =>
    rawInvoices
      .map((rawInvoice) => invoiceSummaryDbSchema.parse(rawInvoice))
      .map(dbSummaryToInvoiceSummary)
  )
}

export function create(
  newInvoice: CreateInvoiceRequest
): Promise<InvoiceDetail> {
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
    paymentTerm,
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

  let paymentTermValue = 0
  if (paymentTerm) {
    paymentTermValue = paymentTerm.value
  }

  const paymentDue = add(issuedAt, { days: paymentTermValue })

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
    paymentTerm: paymentTerm ?? undefined,
    paymentDue,
    amountDue,
    ...restInvoice,
  }
}

function dbCreate(invoice: Prisma.InvoiceCreateInput) {
  return prisma.invoice.create({
    data: invoice,
    select: invoiceDetailSelect,
  })
}
function dbUpdate(id: string, invoice: Prisma.InvoiceUpdateInput) {
  return prisma.invoice.update({
    where: {
      id: id,
    },
    data: invoice,
    select: invoiceDetailSelect,
  })
}

type DBCreateInvoiceReturn = AsyncReturnType<typeof dbCreate>

const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  postcode: z.string().min(1),
})

const possiblyEmptyString = z
  .string()
  .nullable()
  .transform((val) => val ?? '')

const draftAddressSchema = z.object({
  street: possiblyEmptyString,
  city: possiblyEmptyString,
  country: possiblyEmptyString,
  postcode: possiblyEmptyString,
})

const draftInvoiceDetailSchema = schemaForType<DBCreateInvoiceReturn>()(
  z.object({
    id: z.string().min(1),
    status: z.literal('draft'),
    issuedAt: z.date(),
    paymentTermId: z.number(),
    paymentTerm: z.object({
      id: z.number(),
      value: z.number(),
      name: z.string(),
    }),
    projectDescription: possiblyEmptyString,
    sender: z.object({
      address: draftAddressSchema,
    }),
    client: z.object({
      name: possiblyEmptyString,
      email: possiblyEmptyString,
      address: draftAddressSchema,
    }),
    invoiceItems: z.array(
      z.object({
        id: z.number(),
        quantity: z.number().min(1),
        item: z.object({
          name: possiblyEmptyString,
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
    paymentTermId: z.number(),
    paymentTerm: z.object({
      id: z.number(),
      value: z.number(),
      name: z.string(),
    }),
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
const paidInvoiceDetailSchema = pendingInvoiceDetailSchema
  .omit({ status: true })
  .extend({ status: z.literal('paid') })

const invoiceDetailSchema = z.union([
  draftInvoiceDetailSchema,
  pendingInvoiceDetailSchema,
  paidInvoiceDetailSchema,
])

function prepareInvoiceForCreate(
  newInvoice: CreateInvoiceRequest
): Prisma.InvoiceCreateInput {
  const {
    clientName,
    clientEmail,
    clientAddress,
    senderAddress,
    itemList,
    paymentTermId,
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

  const paymentTerm = { connect: { id: paymentTermId } }

  const invoiceToSave = {
    id,
    sender,
    client,
    invoiceItems,
    paymentTerm,
    ...restInvoice,
  }

  return invoiceToSave
}
function prepareInvoiceForUpdate(
  id: InvoiceDetail['id'],
  updatedInvoice: UpdateInvoiceRequest
): Prisma.InvoiceUpdateInput {
  const {
    clientName,
    clientEmail,
    clientAddress,
    senderAddress,
    itemList,
    paymentTermId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    issuedAt: _thrownAwayIssuedAt,
    ...restInvoice
  } = updatedInvoice

  const sender: Prisma.SenderUpdateOneRequiredWithoutInvoiceInput = {
    update: {
      address: {
        update: senderAddress,
      },
    },
  }

  const client: Prisma.ClientUpdateOneRequiredWithoutInvoiceInput = {
    update: {
      name: clientName,
      email: clientEmail,
      address: {
        update: clientAddress,
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

  const paymentTerm = { connect: { id: paymentTermId } }

  const invoiceToSave: Prisma.InvoiceUpdateInput = {
    id,
    sender,
    client,
    paymentTerm,
    invoiceItems: {
      // delete the existing items
      deleteMany: {},
      // add the new ones
      ...invoiceItems,
    },
    ...restInvoice,
  }

  return invoiceToSave
}

const invoiceDetailSelect = {
  id: true,
  status: true,
  issuedAt: true,
  paymentTermId: true,
  paymentTerm: {
    select: {
      id: true,
      value: true,
      name: true,
    },
  },
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
}

function dbFindInvoiceDetail(id: InvoiceDetail['id']) {
  return prisma.invoice.findUnique({
    where: { id },
    select: invoiceDetailSelect,
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

type InvoiceStatus = InvoiceDetail['status']
const allowedStatusTransitions: Record<InvoiceStatus, Array<InvoiceStatus>> = {
  draft: ['draft', 'pending'],
  pending: ['pending', 'paid'],
  paid: [],
}

function isStatusTransitionValid(
  from: InvoiceStatus,
  to: InvoiceStatus
): boolean {
  return allowedStatusTransitions[from].includes(to)
}

export async function update(
  id: InvoiceDetail['id'],
  updatedInvoice: UpdateInvoiceRequest
): Promise<InvoiceDetail> {
  const existingInvoice = await findInvoiceDetail(id)

  if (!isStatusTransitionValid(existingInvoice.status, updatedInvoice.status)) {
    throw new ActionNotPermittedError(
      `Cannot update invoice ${id} from ${existingInvoice.status} to ${updatedInvoice.status}`
    )
  }

  const invoiceToSave = prepareInvoiceForUpdate(id, updatedInvoice)

  return dbUpdate(id, invoiceToSave)
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
