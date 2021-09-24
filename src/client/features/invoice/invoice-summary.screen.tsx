import { Drawer, useDrawer } from 'src/client/shared/components/drawer'
import {
  MouseEventHandler,
  TableHTMLAttributes,
  useCallback,
  useRef,
  useState,
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

import { ArrowRight } from 'src/client/shared/icons/arrow-right'
import { Button } from 'src/client/shared/components/button'
import { Heading } from 'src/client/shared/components/typography'
import Image from 'next/image'
import { InvoiceForm } from './invoice-form'
import { InvoiceSummary } from './invoice.types'
import Link from 'next/link'
import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { StatusBadge } from 'src/client/shared/components/status-badge'
import { currencyFormatterGBP } from 'src/client/shared/currency'
import { format } from 'date-fns'
import { inflect } from 'src/client/shared/grammar'
import { useId } from '@react-aria/utils'
import { useScreenReaderNotification } from 'src/client/shared/components/screen-reader-notification'

export function InvoiceSummaryScreen(): JSX.Element {
  const [filterStatus, setFilterStatus] = useState<InvoiceSummary['status'][]>(
    []
  )

  const listQuery = useInvoiceSummaries({
    filters: {
      status: filterStatus,
    },
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

  return (
    <>
      <header className={header}>
        <div>
          <Heading level={1} id={headingId} className={heading}>
            Invoices
          </Heading>
          <TotalInvoiceCount />
        </div>
        <label>
          Filter by status
          <select
            multiple
            value={filterStatus}
            onChange={(event) =>
              setFilterStatus(
                Array.from(event.target.selectedOptions).map(
                  (option) => option.value as InvoiceSummary['status']
                )
              )
            }
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </label>
        <Button type="button" icon="plus" onClick={() => open()}>
          New Invoice
        </Button>
      </header>
      {listQuery.isLoading ? <div>Loading...</div> : null}
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
