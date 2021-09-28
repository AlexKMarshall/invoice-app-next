import * as z from 'zod'

import { NewInvoiceInputDTO } from './dtos'

function schemaForType<T>() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <S extends z.ZodType<T, any, any>>(arg: S) => arg
}

const addressSchema = z.object({
  street: z.string().min(1, { message: "can't be empty" }),
  city: z.string().min(1, { message: "can't be empty" }),
  country: z.string().min(1, { message: "can't be empty" }),
  postcode: z.string().min(1, { message: "can't be empty" }),
})

const draftAddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  country: z.string(),
  postcode: z.string(),
})

const newDraftInvoiceInputDtoSchema = schemaForType<NewInvoiceInputDTO>()(
  z.object({
    status: z.literal('draft'),
    senderAddress: draftAddressSchema,
    clientName: z.string(),
    clientEmail: z.union([z.string().email(), z.literal('')]),
    clientAddress: draftAddressSchema,
    issuedAt: z.date(),
    paymentTerms: z.number().min(0),
    projectDescription: z.string(),
    itemList: z.array(
      z.object({
        name: z.string().min(1),
        quantity: z.number().min(1),
        price: z.number().min(0),
      })
    ),
  })
)

const newPendingInvoiceInputDtoSchema = schemaForType<NewInvoiceInputDTO>()(
  z.object({
    status: z.literal('pending'),
    senderAddress: addressSchema,
    clientName: z.string().min(1, { message: "can't be empty" }),
    clientEmail: z.string().min(1, { message: "can't be empty" }).email(),
    clientAddress: addressSchema,
    issuedAt: z.date(),
    paymentTerms: z.number().min(0),
    projectDescription: z.string().min(1, { message: "can't be empty" }),
    itemList: z.array(
      z.object({
        name: z.string().min(1, { message: "can't be empty" }),
        quantity: z.number().min(1),
        price: z.number().min(0),
      })
    ),
  })
)

export const newInvoiceInputDtoSchema = z.union([
  newDraftInvoiceInputDtoSchema,
  newPendingInvoiceInputDtoSchema,
])

export const updateInvoiceInputDtoSchema = z.union([
  newDraftInvoiceInputDtoSchema.omit({ issuedAt: true }),
  newPendingInvoiceInputDtoSchema.omit({ issuedAt: true }),
])

export const updateStatusInputDtoSchema = z.object({
  status: z.literal('paid'),
})

export const statusSchema = z.enum(['draft', 'pending', 'paid'])

export const getInvoicesQuerySchema = z.object({
  status: z.union([statusSchema, z.array(statusSchema)]).optional(),
})
