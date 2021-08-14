import { currencyFormatter, inflect } from 'src/client/shared/utils'

import { Heading as BaseHeading } from 'src/client/shared/components/typography'
import { Button } from 'src/client/shared/components/button'
import { InvoiceSummary } from './invoice.types'
import Link from 'next/link'
import { NewInvoiceForm } from './new-invoice-form'
import { format } from 'date-fns'
import styled from 'styled-components'
import { useId } from '@react-aria/utils'
import { useInvoiceSummaries } from './invoice.queries'
import { useState } from 'react'

export function InvoiceSummaryScreen(): JSX.Element {
  const listQuery = useInvoiceSummaries()
  const [notificationMessage, setNotificationMessage] = useState('')
  const headingId = useId()
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <Main>
      <Header>
        <div>
          <Heading id={headingId}>Invoices</Heading>
          <TotalInvoiceCount />
        </div>
        <Button type="button" icon="plus" onClick={() => setIsFormOpen(true)}>
          New Invoice
        </Button>
      </Header>
      {listQuery.isLoading ? <div>Loading...</div> : null}
      {listQuery.isSuccess ? (
        <List
          aria-labelledby={headingId}
          collection={listQuery.data}
          renderItem={(invoice) => (
            <InvoiceSummaryItem key={invoice.id} invoice={invoice} />
          )}
          emptyState={
            <>
              <h2>There is nothing here</h2>
              <p>
                Create an invoice by clicking the <strong>New Invoice</strong>{' '}
                button and get started
              </p>
            </>
          }
        />
      ) : null}
      {isFormOpen && (
        <NewInvoiceForm
          onSubmitSuccess={(savedInvoice) => {
            setNotificationMessage(
              `New invoice id ${savedInvoice.id} successfully created`
            )
          }}
        />
      )}
      <div role="status" aria-live="polite">
        {notificationMessage}
      </div>
    </Main>
  )
}

type ListProps<T> = {
  collection: Array<T>
  renderItem: (item: T, index: number, collection: Array<T>) => JSX.Element
  emptyState: JSX.Element
} & React.ComponentPropsWithoutRef<'ul' | 'ol'>

function List<T>({
  collection,
  renderItem,
  emptyState,
  ...delegatedProps
}: ListProps<T>) {
  return collection.length > 0 ? (
    <ul role="list" {...delegatedProps}>
      {collection.map(renderItem)}
    </ul>
  ) : (
    emptyState
  )
}

type InvoiceSummaryItemProps = {
  invoice: InvoiceSummary
}

function InvoiceSummaryItem({ invoice }: InvoiceSummaryItemProps) {
  const id = useId()
  const savingInvoiceIdDisplay = '------'
  return (
    <li aria-labelledby={id}>
      {invoice.id.toLowerCase().startsWith('saving') ? (
        <div id={id}>{savingInvoiceIdDisplay}</div>
      ) : (
        <Link href={`/invoices/${invoice.id}`}>
          <a id={id}>{invoice.id}</a>
        </Link>
      )}
      <div>{`Due ${format(invoice.paymentDue, 'dd MMM yyyy')}`}</div>
      <div>{invoice.clientName}</div>
      <div>{currencyFormatter.format(invoice.total / 100)}</div>
      <div>{invoice.status}</div>
    </li>
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
      There are {count} total {inflect('invoice')(count)}
    </div>
  )
}

const Main = styled.main`
  max-width: 730px;
  margin-left: auto;
  margin-right: auto;
`

const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-top: 72px;
  margin-bottom: 65px;

  & > :first-child {
    margin-right: auto;
  }
`

const Heading = styled(BaseHeading)`
  margin-bottom: 8px;
`
