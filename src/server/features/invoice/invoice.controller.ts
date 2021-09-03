import * as invoiceModel from './invoice.model'
import * as z from 'zod'

import {
  GetInvoiceSummaryDTO,
  NewInvoiceInputDTO,
  NewInvoiceReturnDTO,
} from 'src/shared/dtos'
import { JsonArray, JsonObject } from 'type-fest'

import { parseJSON } from 'date-fns'

export type ControllerResponse<TData = unknown> = Promise<
  ControllerSuccessResponse<TData> | ControllerErrorResponse
>

type ControllerSuccessResponse<TData = unknown> = {
  code: number
  response: TData
}

type ControllerErrorResponse<TError = unknown> = {
  code: number
  response: {
    error: TError
  }
}

export function getInvoices(): ControllerResponse<GetInvoiceSummaryDTO> {
  return invoiceModel
    .findAll()
    .then((invoices) => ({ code: 200, response: { data: { invoices } } }))
    .catch((error) => ({
      code: 500,
      response: { error: JSON.stringify(error) },
    }))
}

export function postInvoice(
  newInvoice: JsonObject | JsonArray
): ControllerResponse<NewInvoiceReturnDTO> {
  const parsingResult = parseNewInvoiceInputDto(newInvoice)

  if (!parsingResult.success) {
    return Promise.resolve({
      code: 400,
      response: { error: parsingResult.error },
    })
  }

  const parsedInvoice = parsingResult.data

  return invoiceModel
    .create(parsedInvoice)
    .then((savedInvoice) => ({
      code: 201,
      response: { data: { savedInvoice } },
    }))
    .catch((error) => ({
      code: 500,
      response: { error: JSON.stringify(error) },
    }))
}

type SafeParse<T> =
  | { success: true; data: T }
  | {
      success: false
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: any
    }

function parseNewInvoiceInputDto(
  newInvoiceInput: JsonObject | JsonArray
): SafeParse<NewInvoiceInputDTO> {
  const buildingInvoice = { ...newInvoiceInput }

  if (
    'issuedAt' in buildingInvoice &&
    typeof buildingInvoice.issuedAt === 'string'
  ) {
    Object.assign(buildingInvoice, {
      issuedAt: parseJSON(buildingInvoice.issuedAt),
    })
  }

  const result = newInvoiceInputDtoSchema.safeParse(buildingInvoice)

  if (result.success === false) {
    return { ...result, error: flattenError(result.error) }
  }

  return result
}

function schemaForType<T>() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <S extends z.ZodType<T, any, any>>(arg: S) => arg
}

const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  postcode: z.string().min(1),
})

const newInvoiceInputDtoSchema = schemaForType<NewInvoiceInputDTO>()(
  z.object({
    status: z.enum(['draft', 'pending']),
    senderAddress: addressSchema,
    clientName: z.string().min(1),
    clientEmail: z.string().email(),
    clientAddress: addressSchema,
    issuedAt: z.date(),
    paymentTerms: z.number().min(0),
    projectDescription: z.string().min(1),
    itemList: z.array(
      z.object({
        name: z.string().min(1),
        quantity: z.number().min(1),
        price: z.number().min(0),
      })
    ),
  })
)

function flattenError(
  error: z.ZodError<z.infer<typeof newInvoiceInputDtoSchema>>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldErrors: any = {}
  for (const issue of error.issues) {
    if (issue.path.length > 0) {
      if (issue.path.length === 1) {
        fieldErrors[issue.path[0]] ??= []
        fieldErrors[issue.path[0]].push(issue.message)
      } else if (issue.path.length === 2) {
        fieldErrors[issue.path[0]] ??= {}
        fieldErrors[issue.path[0]][issue.path[1]] ??= []
        fieldErrors[issue.path[0]][issue.path[1]].push(issue.message)
      } else {
        fieldErrors[issue.path[0]] ??= {}
        fieldErrors[issue.path[0]][issue.path[1]] ??= {}
        fieldErrors[issue.path[0]][issue.path[1]][issue.path[2]] ??= []
        fieldErrors[issue.path[0]][issue.path[1]][issue.path[2]].push(
          issue.message
        )
      }
    } else {
      // form error
    }
  }
  return { fieldErrors }
}
