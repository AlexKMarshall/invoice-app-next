import { UseQueryResult, useQuery } from 'react-query'

import { PaymentTerm } from './payment-term.types'
import { getPaymentTerms } from './payment-term.api-client'

const paymentTermKeys = {
  all: ['payment-terms'] as const,
  lists: () => [...paymentTermKeys.all, 'list'] as const,
  list: () => [...paymentTermKeys.lists()] as const,
}

type UsePaymentTermsProps = {
  enabled?: boolean
}

export function usePaymentTerms({
  enabled,
}: UsePaymentTermsProps = {}): UseQueryResult<Array<PaymentTerm>> {
  return useQuery(paymentTermKeys.list(), () => getPaymentTerms(), {
    enabled,
  })
}
