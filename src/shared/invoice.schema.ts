import * as z from 'zod'

import { NewDraftInvoiceInputDTO, NewPendingInvoiceInputDTO } from './dtos'

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

const newDraftInvoiceInputDtoSchema = schemaForType<NewDraftInvoiceInputDTO>()(
  z.object({
    status: z.literal('draft'),
    senderAddress: addressSchema,
    clientName: z.string().optional(),
    clientEmail: z
      .union([z.string().email(), z.string().max(0, 'Invalid email')])
      .optional(),
    clientAddress: addressSchema,
    issuedAt: z.date(),
    paymentTerms: z.number().min(0),
    projectDescription: z.string().optional(),
    itemList: z.array(
      z.object({
        name: z.string().min(1),
        quantity: z.number().min(1),
        price: z.number().min(0),
      })
    ),
  })
)

const newPendingInvoiceInputDtoSchema =
  schemaForType<NewPendingInvoiceInputDTO>()(
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
