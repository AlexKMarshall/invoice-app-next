import { COLORS, TYPOGRAPHY } from 'src/client/shared/styles/theme'
import { MouseEventHandler, TableHTMLAttributes, useRef, useState } from 'react'
import { currencyFormatter, inflect } from 'src/client/shared/utils'

import { ArrowRight } from 'src/client/shared/icons/arrow-right'
import { Heading as BaseHeading } from 'src/client/shared/components/typography'
import { Button } from 'src/client/shared/components/button'
import Image from 'next/image'
import { InvoiceSummary } from './invoice.types'
import Link from 'next/link'
import { NewInvoiceForm } from './new-invoice-form'
import { StatusBadge } from 'src/client/shared/components/status-badge'
import { format } from 'date-fns'
import styled from 'styled-components'
import { useId } from '@react-aria/utils'
import { useInvoiceSummaries } from './invoice.queries'

export function InvoiceSummaryScreen(): JSX.Element {
  const listQuery = useInvoiceSummaries()
  const [notificationMessage, setNotificationMessage] = useState('')
  const headingId = useId()
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <Main>
      <Header>
        <div>
          <Heading level={1} id={headingId}>
            Invoices
          </Heading>
          <TotalInvoiceCount />
        </div>
        <Button type="button" icon="plus" onClick={() => setIsFormOpen(true)}>
          New Invoice
        </Button>
      </Header>
      {listQuery.isLoading ? <div>Loading...</div> : null}
      {listQuery.isSuccess ? (
        <Table
          aria-labelledby={headingId}
          collection={listQuery.data}
          renderItem={(invoice) => (
            <InvoiceSummaryItem key={invoice.id} invoice={invoice} />
          )}
          emptyState={
            <EmptyStateWrapper>
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
            </EmptyStateWrapper>
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

const Main = styled.main`
  max-width: 730px;
  margin-left: auto;
  margin-right: auto;
`

const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding-top: 72px;
  padding-bottom: 65px;

  & > :first-child {
    margin-right: auto;
  }
`

const Heading = styled(BaseHeading)`
  margin-bottom: 8px;
`

const EmptyStateWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: min-content;
  text-align: center;
  padding-top: 48px;

  & > :nth-child(2) {
    margin-top: 64px;
    margin-bottom: 24px;
    white-space: nowrap;
  }
`

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
    <TableWrapper {...delegatedProps}>
      <tbody>{collection.map(renderItem)}</tbody>
    </TableWrapper>
  ) : (
    emptyState
  )
}

const TableWrapper = styled.table`
  width: 100%;

  border-spacing: 0 1rem;
  margin-top: -1rem;
  margin-bottom: -1rem;
`

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
    <RowWrapper
      aria-labelledby={id}
      data-saving={isSaving ? 'true' : undefined}
      onClick={(event) => handleInvoiceClick(event)}
    >
      {isSaving ? (
        <Cell scope="row" id={id}>
          <InvoiceId>{savingInvoiceIdDisplay}</InvoiceId>
        </Cell>
      ) : (
        <Cell scope="row" id={id}>
          <Link href={`/invoices/${invoice.id}`} passHref>
            <InvoiceId as="a" ref={linkRef}>
              {invoice.id}
            </InvoiceId>
          </Link>
        </Cell>
      )}
      <Cell>{`Due ${format(invoice.paymentDue, 'dd MMM yyyy')}`}</Cell>
      <Cell>{invoice.clientName}</Cell>
      <Cell style={{ textAlign: 'right' }}>
        <InvoiceTotal>
          {currencyFormatter.format(invoice.total / 100)}
        </InvoiceTotal>
      </Cell>
      <Cell>
        <StatusBadge status={invoice.status} />
        <DecorativeIcon>
          <ArrowRight />
        </DecorativeIcon>
      </Cell>
    </RowWrapper>
  )
}

const RowWrapper = styled.tr`
  --cursor: pointer;
  position: relative;
  --border-radius: 8px;
  box-shadow: 0 10px 10px -10px ${COLORS.shadowColor.prop};
  --border-color: transparent;
  --border-width: 2px;
  --border-style: solid;
  --border: var(--border-width) var(--border-style) var(--border-color);

  cursor: var(--cursor);

  & a:focus {
    outline: none;
  }

  &:hover:not([data-saving]),
  &:focus-within:not([data-saving]) {
    --border-color: ${COLORS.primaryColor.prop};
  }

  &[data-saving] {
    --cursor: default;
  }

  & > * {
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-top: var(--border);
    border-bottom: var(--border);
    padding-left: 1.25rem;
    padding-right: 1.25rem;

    &:first-child {
      padding-left: 2rem;
      border-left: var(--border);
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
    }

    &:last-child {
      padding-right: 3rem;
      border-right: var(--border);
      border-top-right-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
    }
  }
`

const Cell = styled.td`
  background-color: white;
`

const DecorativeIcon = styled.div`
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: ${COLORS.primaryColor.prop};

  & > * {
    display: block;
    width: 7px;
    height: 10px;
  }
`

const InvoiceId = styled.span`
  color: ${COLORS.textColor.strong.prop};
  font-weight: ${TYPOGRAPHY.fontWeight.bold.prop};
  text-decoration: none;

  &:before {
    content: '#';
    color: ${COLORS.textColor.prop};
  }
`

const InvoiceTotal = styled.span`
  font-size: ${TYPOGRAPHY.h3.fontSize};
  font-weight: ${TYPOGRAPHY.fontWeight.bold.prop};
  letter-spacing: ${TYPOGRAPHY.h3.letterSpacing};
  color: ${COLORS.textColor.strong.prop};
`

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
