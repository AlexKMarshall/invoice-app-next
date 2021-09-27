import {
  Button,
  Checkbox,
  CheckboxGroup,
  Drawer,
  Filter,
  Heading,
  StatusBadge,
  useDrawer,
  useScreenReaderNotification,
} from 'src/client/shared/components'
import {
  MouseEventHandler,
  TableHTMLAttributes,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import {
  cell,
  drawerTitle,
  emptyStateWrapper,
  header,
  heading,
  iconSvg,
  iconWrapper,
  invoiceId,
  rowLink,
  rowWrapper,
  table,
} from './invoice-summary.screen.css'
import { useCreateInvoice, useInvoiceSummaries } from './invoice.queries'

import { ArrowRight } from 'src/client/shared/icons/'
import Image from 'next/image'
import { InvoiceForm } from './invoice-form'
import { InvoiceSummary } from './invoice.types'
import Link from 'next/link'
import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { currencyFormatterGBP } from 'src/client/shared/currency'
import { format } from 'date-fns'
import { inflect } from 'src/client/shared/grammar'
import { toArray } from 'src/shared/array'
import { useId } from '@react-aria/utils'
import { useRouter } from 'next/router'

type InvoiceStatus = InvoiceSummary['status']
const statuses: InvoiceSummary['status'][] = ['draft', 'pending', 'paid']

export function InvoiceSummaryScreen(): JSX.Element {
  const router = useRouter()

  const filterStatuses: InvoiceSummary['status'][] = useMemo(() => {
    if (router.isReady && router.query.status) {
      const unvalidatedStatuses = toArray(router.query.status)
      // TODO fix the typing
      return unvalidatedStatuses.filter((unvalidatedStatus) =>
        statuses.includes(unvalidatedStatus as InvoiceStatus)
      ) as InvoiceStatus[]
    }
    return []
  }, [router.isReady, router.query.status])

  const listQuery = useInvoiceSummaries({
    filters: {
      status: filterStatuses,
    },
    enabled: router.isReady,
  })
  const { notify } = useScreenReaderNotification()
  const headingId = useId()
  const { open, close, titleId: drawerTitleId } = useDrawer()
  const createInvoiceMutation = useCreateInvoice({
    onSuccess: (savedInvoice) => {
      notify(`New invoice id ${savedInvoice.id} successfully created`)
    },
  })

  const handleCreateFormSubmit = useCallback(
    (data: NewInvoiceInputDTO) => {
      createInvoiceMutation.mutate(data)
      close()
    },
    [close, createInvoiceMutation]
  )

  const handleFilterSelectChange = useCallback(
    (selectedStatuses: string[]) => {
      // const selectedStatuses = Array.from(selectedOptions).map(
      //   (option) => option.value as InvoiceSummary['status']
      // )

      const searchParams = new URLSearchParams()
      selectedStatuses.forEach((status) => {
        searchParams.append('status', status)
      })

      const searchParamsString = searchParams.toString()
      const queryString = searchParamsString ? `?${searchParamsString}` : ''

      router.push(`${router.pathname}${queryString}`)
    },
    [router]
  )

  const filterButtonId = useId()

  return (
    <>
      <header className={header}>
        <div>
          <Heading level={1} id={headingId} className={heading}>
            Invoices
          </Heading>
          <TotalInvoiceCount />
        </div>
        <Filter label="Filter by status" id={filterButtonId}>
          <CheckboxGroup
            aria-labelledby={filterButtonId}
            value={filterStatuses}
            onChange={handleFilterSelectChange}
          >
            <Checkbox value="draft">Draft</Checkbox>
            <Checkbox value="pending">Pending</Checkbox>
            <Checkbox value="paid">Paid</Checkbox>
          </CheckboxGroup>
        </Filter>

        <Button type="button" icon="plus" onClick={() => open()}>
          New Invoice
        </Button>
      </header>
      {listQuery.isLoading || listQuery.isIdle ? <div>Loading...</div> : null}
      {listQuery.isSuccess ? (
        <Table
          aria-labelledby={headingId}
          collection={listQuery.data}
          renderItem={(invoice) => (
            <InvoiceSummaryItem key={invoice.id} invoice={invoice} />
          )}
          emptyState={
            <div className={emptyStateWrapper}>
              <Image
                src="/illustration-empty.svg"
                alt="Illustration of woman with a megaphone emerging from an open envelope, with a paper aeroplane flying around her"
                width="241"
                height="200"
              />
              <Heading level={2}>There is nothing here</Heading>
              <p>
                Create an invoice by clicking the <strong>New Invoice</strong>{' '}
                button and get started
              </p>
            </div>
          }
        />
      ) : null}
      <Drawer>
        <h2 className={drawerTitle} id={drawerTitleId}>
          New Invoice
        </h2>
        <InvoiceForm
          kind="create"
          aria-labelledby={drawerTitleId}
          onCancel={close}
          onSubmit={handleCreateFormSubmit}
        />
      </Drawer>
    </>
  )
}

type TableProps<T> = {
  collection: Array<T>
  renderItem: (item: T, index: number, collection: Array<T>) => JSX.Element
  emptyState: JSX.Element
} & TableHTMLAttributes<HTMLTableElement>

function Table<T>({
  collection,
  renderItem,
  emptyState,
  ...delegatedProps
}: TableProps<T>) {
  return collection.length > 0 ? (
    <table {...delegatedProps} className={table}>
      <tbody>{collection.map(renderItem)}</tbody>
    </table>
  ) : (
    emptyState
  )
}

type InvoiceSummaryItemProps = {
  invoice: InvoiceSummary
}

function InvoiceSummaryItem({ invoice }: InvoiceSummaryItemProps) {
  const id = useId()
  const isSaving = invoice.id.toLowerCase().startsWith('saving')
  const savingInvoiceIdDisplay = '------'
  const linkRef = useRef<HTMLAnchorElement>(null)

  const handleInvoiceClick: MouseEventHandler = (event) => {
    // don't click if we don't have a link
    if (!linkRef.current) return
    // don't duplicate the click if we already clicked on the real link element
    if (event.target === linkRef.current) return

    linkRef.current.click()
  }

  return (
    <tr
      className={rowWrapper({ saving: isSaving || undefined })}
      aria-labelledby={id}
      onClick={(event) => handleInvoiceClick(event)}
    >
      {isSaving ? (
        <td className={cell} scope="row" id={id}>
          <span className={invoiceId}>{savingInvoiceIdDisplay}</span>
        </td>
      ) : (
        <td className={cell} scope="row" id={id}>
          <Link href={`/invoices/${invoice.id}`} passHref>
            <a ref={linkRef} className={`${rowLink} ${invoiceId}`}>
              {invoice.id}
            </a>
          </Link>
        </td>
      )}
      <td className={cell}>{`Due ${format(
        invoice.paymentDue,
        'dd MMM yyyy'
      )}`}</td>
      <td className={cell}>{invoice.clientName}</td>
      <td className={cell} style={{ textAlign: 'right' }}>
        <Heading level={3} as="span">
          <GBPValue value={invoice.amountDue} />
        </Heading>
      </td>
      <td className={cell}>
        <StatusBadge status={invoice.status} />
        <div className={iconWrapper}>
          <ArrowRight className={iconSvg} />
        </div>
      </td>
    </tr>
  )
}

function TotalInvoiceCount() {
  const countQuery = useInvoiceSummaries({
    select: (invoices) => invoices.length,
  })
  if (!countQuery.isSuccess) return null

  const count = countQuery.data

  if (count === 0) return <div>No invoices</div>

  return (
    <div>
      There {inflect('is', 'are')(count)} {count} total{' '}
      {inflect('invoice')(count)}
    </div>
  )
}

type GBPValueProps = {
  value: number
}
function GBPValue({ value }: GBPValueProps) {
  const [poundSign, ...rest] = currencyFormatterGBP.format(value).split('')
  const formattedValue = rest.join('')

  return (
    <>
      {poundSign}&nbsp;{formattedValue}
    </>
  )
}
