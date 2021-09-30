import { GetPaymentTermsResponse } from 'src/shared/dtos'
import { PaymentTerm } from './payment-term.types'
import { client } from 'src/client/shared/api-client'

export async function getPaymentTerms(): Promise<Array<PaymentTerm>> {
  const { data } = await client<GetPaymentTermsResponse>(`/api/payment-terms`)

  return data.paymentTerms
}
