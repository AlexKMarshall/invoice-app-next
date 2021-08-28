import * as invoiceModel from './invoice.model'

import {
  GetInvoiceSummaryDTO,
  NewInvoiceInputDTO,
  NewInvoiceReturnDTO,
  Stringify,
} from 'src/shared/dtos'

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
  newInvoice: Stringify<NewInvoiceInputDTO>
): ControllerResponse<NewInvoiceReturnDTO> {
  const invoiceWithDates = {
    ...newInvoice,
    issuedAt: parseJSON(newInvoice.issuedAt),
  }

  return invoiceModel.create(invoiceWithDates).then((savedInvoice) => ({
    code: 201,
    response: { data: { savedInvoice } },
  }))
}
