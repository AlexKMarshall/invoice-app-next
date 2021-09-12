import { InvoiceDetail, InvoiceSummary } from './invoice.types'
import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'
import {
  getInvoiceDetail,
  getInvoices,
  postInvoice,
} from './invoice.api-client'

import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { invoiceDetailFromInput } from './invoice.mappers'
import { nanoid } from 'nanoid'

const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (filters = '') => [...invoiceKeys.lists(), { filters }] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
}

type UseInvoiceSummariesProps<TData> = {
  filters?: string
  select?: (invoices: Array<InvoiceSummary>) => TData
}

export function useInvoiceSummaries<TData = Array<InvoiceSummary>>({
  filters = '',
  select,
}: UseInvoiceSummariesProps<TData> = {}): UseQueryResult<TData> {
  return useQuery(invoiceKeys.list(filters), getInvoices, { select })
}

type useInvoiceDetailOptions = {
  enabled?: boolean
}

export function useInvoiceDetail(
  id: InvoiceDetail['id'],
  options: useInvoiceDetailOptions = {}
): UseQueryResult<InvoiceDetail> {
  return useQuery(invoiceKeys.detail(id), () => getInvoiceDetail(id), options)
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
            invoiceDetailFromInput(newInvoice, pendingId),

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
            invoice.id === pendingId ? savedInvoiceDetail : invoice
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
