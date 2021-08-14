import { InvoiceDetail, InvoiceSummary } from './invoice.types'
import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'
import { getInvoices, postInvoice } from './invoice.api-client'

import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { invoiceDetailToSummary } from './invoice.utils'
import { nanoid } from 'nanoid'

const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (filters = '') => [...invoiceKeys.lists(), { filters }] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
}

export function useInvoiceSummaries(
  filters = ''
): UseQueryResult<Array<InvoiceSummary>> {
  return useQuery(invoiceKeys.list(filters), getInvoices)
}

type UseCreateInvoiceProps = {
  onSuccess?: UseMutationOptions<
    InvoiceDetail,
    unknown,
    NewInvoiceInputDTO
  >['onSuccess']
}

export function useCreateInvoice({
  onSuccess,
}: UseCreateInvoiceProps): UseMutationResult<
  InvoiceDetail,
  unknown,
  NewInvoiceInputDTO,
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation(
    (newInvoice: NewInvoiceInputDTO) => postInvoice(newInvoice),
    {
      onMutate: async (newInvoice: NewInvoiceInputDTO) => {
        await queryClient.cancelQueries(invoiceKeys.all)
        const previousInvoices =
          queryClient.getQueryData<Array<InvoiceSummary>>(invoiceKeys.list()) ??
          []

        const pendingId = `SAVING-${nanoid()}`
        if (previousInvoices) {
          queryClient.setQueryData<Array<InvoiceSummary>>(invoiceKeys.list(), [
            invoiceDetailToSummary({ ...newInvoice, id: pendingId }),
            ...previousInvoices,
          ])
        }

        return { previousInvoices, pendingId }
      },
      onSuccess: async (savedInvoiceDetail, _newInvoiceInput, context) => {
        // if we didn't get a pendingId from onMutate, we can't update the cache manually
        // we should just invalidate the queries instead
        const pendingId = context?.pendingId
        if (!pendingId) return

        await queryClient.cancelQueries(invoiceKeys.all)
        const previousInvoices = queryClient.getQueryData<
          Array<InvoiceSummary>
        >(invoiceKeys.list())

        if (previousInvoices) {
          const updatedInvoices = previousInvoices.map((invoice) =>
            invoice.id === pendingId
              ? invoiceDetailToSummary(savedInvoiceDetail)
              : invoice
          )

          queryClient.setQueryData<Array<InvoiceSummary>>(
            invoiceKeys.list(),
            updatedInvoices
          )
        }

        onSuccess?.(savedInvoiceDetail, _newInvoiceInput, context)
      },
    }
  )
}
