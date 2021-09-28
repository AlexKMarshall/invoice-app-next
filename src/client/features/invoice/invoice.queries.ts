import { CreateInvoiceRequest, UpdateInvoiceRequest } from 'src/shared/dtos'
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
  deleteInvoice,
  getInvoiceDetail,
  getInvoices,
  postInvoice,
  updateInvoice,
  updateStatus,
} from './invoice.api-client'

import { invoiceDetailFromInput } from './invoice.mappers'
import { nanoid } from 'nanoid'

type InvoiceSummaryFilters = {
  status?: InvoiceSummary['status'][]
}

const emptyFilters: InvoiceSummaryFilters = { status: [] }

function normaliseFilters(
  filters: InvoiceSummaryFilters
): InvoiceSummaryFilters {
  if (filters.status) {
    const sortedStatus = [...filters.status].sort()
    return { status: sortedStatus }
  }

  return filters
}

const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (filters: InvoiceSummaryFilters = emptyFilters) =>
    [...invoiceKeys.lists(), { filters: normaliseFilters(filters) }] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
}

type UseInvoiceSummariesProps<TData> = {
  filters?: { status?: InvoiceSummary['status'][] }
  select?: (invoices: Array<InvoiceSummary>) => TData
  enabled?: boolean
}

export function useInvoiceSummaries<TData = Array<InvoiceSummary>>({
  filters = emptyFilters,
  select,
  enabled,
}: UseInvoiceSummariesProps<TData> = {}): UseQueryResult<TData> {
  return useQuery(invoiceKeys.list(filters), () => getInvoices(filters), {
    select,
    enabled,
  })
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
    CreateInvoiceRequest
  >['onSuccess']
}

export function useCreateInvoice({
  onSuccess,
}: UseCreateInvoiceProps): UseMutationResult<
  InvoiceDetail,
  unknown,
  CreateInvoiceRequest,
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation(
    (newInvoice: CreateInvoiceRequest) => postInvoice(newInvoice),
    {
      onMutate: async (newInvoice: CreateInvoiceRequest) => {
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

type UseMarkAsPaidProps = {
  onSuccess?: UseMutationOptions<
    InvoiceDetail,
    unknown,
    InvoiceDetail['id']
  >['onSuccess']
}

export function useMarkAsPaid({
  onSuccess,
}: UseMarkAsPaidProps = {}): UseMutationResult<
  InvoiceDetail,
  unknown,
  InvoiceDetail['id'],
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation(
    (invoiceId: InvoiceDetail['id']) => updateStatus(invoiceId, 'paid'),
    {
      onMutate: async (invoiceId: InvoiceDetail['id']) => {
        await queryClient.cancelQueries(invoiceKeys.all)

        const previousInvoiceDetail = queryClient.getQueryData<InvoiceDetail>(
          invoiceKeys.detail(invoiceId)
        )

        if (previousInvoiceDetail) {
          queryClient.setQueryData<InvoiceDetail>(
            invoiceKeys.detail(invoiceId),
            {
              ...previousInvoiceDetail,
              status: 'paid',
            }
          )
        }

        return { previousInvoiceDetail }
      },
      onSuccess: async (updatedInvoiceDetail, invoiceId, context) => {
        await queryClient.cancelQueries(invoiceKeys.all)

        queryClient.setQueryData<InvoiceDetail>(
          invoiceKeys.detail(invoiceId),
          updatedInvoiceDetail
        )

        onSuccess?.(updatedInvoiceDetail, invoiceId, context)
      },
    }
  )
}

type UseUpdateInvoiceMutationProps = {
  id: InvoiceDetail['id']
  invoice: UpdateInvoiceRequest
}
type UseUpdateInvoiceProps = Pick<
  UseMutationOptions<InvoiceDetail, unknown, UseUpdateInvoiceMutationProps>,
  'onSuccess'
>
export function useUpdateInvoice({
  onSuccess,
}: UseUpdateInvoiceProps): UseMutationResult<
  InvoiceDetail,
  unknown,
  UseUpdateInvoiceMutationProps
> {
  const queryClient = useQueryClient()

  return useMutation(
    ({ id, invoice }: UseUpdateInvoiceMutationProps) =>
      updateInvoice(id, invoice),
    {
      onMutate: async ({ id, invoice }: UseUpdateInvoiceMutationProps) => {
        await queryClient.cancelQueries(invoiceKeys.all)

        const previousInvoiceDetail = queryClient.getQueryData<InvoiceDetail>(
          invoiceKeys.detail(id)
        )

        if (previousInvoiceDetail) {
          queryClient.setQueryData<InvoiceDetail>(
            invoiceKeys.detail(id),
            invoiceDetailFromInput(
              { ...invoice, issuedAt: previousInvoiceDetail.issuedAt },
              id
            )
          )
        }

        return { previousInvoiceDetail }
      },
      onSuccess: async (updatedInvoiceDetail, mutationProps, context) => {
        await queryClient.cancelQueries(invoiceKeys.all)

        queryClient.setQueryData<InvoiceDetail>(
          invoiceKeys.detail(mutationProps.id),
          updatedInvoiceDetail
        )

        onSuccess?.(updatedInvoiceDetail, mutationProps, context)
      },
    }
  )
}

type UseDeleteInvoiceProps = Pick<
  UseMutationOptions<InvoiceDetail, unknown, InvoiceDetail['id']>,
  'onSuccess' | 'onMutate'
>

export function useDeleteInvoice({
  onSuccess,
  onMutate,
}: UseDeleteInvoiceProps = {}): UseMutationResult<
  InvoiceDetail,
  unknown,
  InvoiceDetail['id'],
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation(
    (invoiceId: InvoiceDetail['id']) => deleteInvoice(invoiceId),
    {
      onMutate: async (invoiceId: InvoiceDetail['id']) => {
        await queryClient.cancelQueries(invoiceKeys.all)

        const previousInvoices = queryClient.getQueryData<
          Array<InvoiceSummary>
        >(invoiceKeys.list())

        if (previousInvoices) {
          queryClient.setQueryData<Array<InvoiceSummary>>(
            invoiceKeys.list(),
            previousInvoices.filter((invoice) => invoice.id !== invoiceId)
          )
        }

        const previousInvoiceDetail = queryClient.getQueryData<InvoiceDetail>(
          invoiceKeys.detail(invoiceId)
        )
        if (previousInvoiceDetail) {
          queryClient.removeQueries(invoiceKeys.detail(invoiceId))
        }

        onMutate?.(invoiceId)

        return { previousInvoices, previousInvoiceDetail }
      },
      onSuccess: async (deletedInvoiceDetail, invoiceId, context) => {
        onSuccess?.(deletedInvoiceDetail, invoiceId, context)
      },
    }
  )
}
