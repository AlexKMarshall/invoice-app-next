import * as invoiceModel from './invoice.model'
import * as z from 'zod'

import { ActionNotPermittedError, NotFoundError } from 'src/server/errors'
import {
  DeleteInvoiceReturnDTO,
  GetInvoiceDetailDTO,
  GetInvoiceSummaryDTO,
  NewInvoiceInputDTO,
  NewInvoiceReturnDTO,
  UpdateInvoiceInputDTO,
  UpdateInvoiceReturnDTO,
} from 'src/shared/dtos'
import { JsonArray, JsonObject } from 'type-fest'
import {
  newInvoiceInputDtoSchema,
  updateStatusInputDtoSchema,
} from 'src/shared/invoice.schema'

import { InvoiceDetail } from './invoice.types'
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

export const getInvoiceSummaries = withErrorHandler(
  function getInvoiceSummaries(): ControllerResponse<GetInvoiceSummaryDTO> {
    return invoiceModel
      .findAll()
      .then((invoices) => ({ code: 200, response: { data: { invoices } } }))
  }
)

export const getInvoiceDetail = withErrorHandler(function getInvoiceDetail(
  id: string
): ControllerResponse<GetInvoiceDetailDTO> {
  return invoiceModel
    .findInvoiceDetail(id)
    .then((invoice) => ({ code: 200, response: { data: { invoice } } }))
})

export const postInvoice = withErrorHandler(function postInvoice(
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

  return invoiceModel.create(parsedInvoice).then((savedInvoice) => ({
    code: 201,
    response: { data: { savedInvoice } },
  }))
})

export const updateStatus = withErrorHandler(function updateStatus(
  id: string,
  status: unknown
): ControllerResponse<UpdateInvoiceReturnDTO> {
  const parsingResult = updateStatusInputDtoSchema.safeParse(status)
  if (!parsingResult.success) {
    return Promise.resolve({
      code: 400,
      response: { error: flattenError(parsingResult.error) },
    })
  }
  const { status: parsedStatus } = parsingResult.data

  return invoiceModel.updateStatus(id, parsedStatus).then((updatedInvoice) => ({
    code: 200,
    response: { data: { updatedInvoice } },
  }))
})

export const updateInvoice = withErrorHandler(function updateInvoice(
  id: InvoiceDetail['id'],
  updatedInvoice: JsonArray | JsonObject
): ControllerResponse<UpdateInvoiceReturnDTO> {
  const parsingResult = parseUpdateInvoiceInputDto(updatedInvoice)

  if (!parsingResult.success) {
    return Promise.resolve({
      code: 400,
      response: { error: parsingResult.error },
    })
  }

  const parsedInvoice = parsingResult.data

  return invoiceModel.update(id, parsedInvoice).then((updatedInvoice) => ({
    code: 200,
    response: { data: { updatedInvoice } },
  }))
})

export const deleteInvoice = withErrorHandler(function deleteInvoice(
  id: InvoiceDetail['id']
): ControllerResponse<DeleteInvoiceReturnDTO> {
  return invoiceModel.remove(id).then((deletedInvoice) => ({
    code: 200,
    response: { data: { deletedInvoice } },
  }))
})

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

function parseUpdateInvoiceInputDto(
  updatedInvoiceInput: JsonObject | JsonArray
): SafeParse<UpdateInvoiceInputDTO> {
  // at the moment there's no difference between the new and update schemas so we can
  // reuse this function. Created a separate declaration in case of future change
  return parseNewInvoiceInputDto(updatedInvoiceInput)
}

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

function errorHandler(error: unknown) {
  if (error instanceof NotFoundError) {
    return { code: 404, response: { error: error.message } }
  }
  if (error instanceof ActionNotPermittedError) {
    return { code: 403, response: { error: error.message } }
  }
  return {
    code: 500,
    response: { error: JSON.stringify(error) },
  }
}

function withErrorHandler<TArgs extends Array<unknown>, TResult>(
  func: (...args: TArgs) => Promise<TResult>
): (...args: TArgs) => Promise<TResult | ControllerErrorResponse> {
  return (...args: TArgs) => func(...args).catch(errorHandler)
}
