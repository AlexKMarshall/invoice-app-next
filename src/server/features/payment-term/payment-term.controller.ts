import * as paymentTermModel from './payment-term.model'

import { ControllerResponse, withErrorHandler } from 'src/server/response'

import { GetPaymentTermsResponse } from 'src/shared/dtos'

export const getPaymentTerms = withErrorHandler(
  function getPaymentTerms(): ControllerResponse<GetPaymentTermsResponse> {
    return paymentTermModel.findAll().then((paymentTerms) => ({
      code: 200,
      response: { data: { paymentTerms } },
    }))
  }
)
