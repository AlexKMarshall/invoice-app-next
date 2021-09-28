import * as paymentTermController from 'src/server/features/payment-term/payment-term.controller'

import { NextApiRequest, NextApiResponse } from 'next'

import { GetPaymentTermsResponse } from 'src/shared/dtos'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetPaymentTermsResponse | { error: unknown }>
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      const { code, response } = await paymentTermController.getPaymentTerms()
      res.status(code).json(response)
    }
  }
}
