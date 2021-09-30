import { GetPaymentTermsResponse } from 'src/shared/dtos'
import { IterableElement } from 'type-fest'

export type PaymentTerm = IterableElement<
  GetPaymentTermsResponse['data']['paymentTerms']
>
