import { GetInvoiceSummary, ResponseStringify } from 'src/shared/dtos'
import { format, parseJSON } from 'date-fns'

import Link from 'next/link'
import { currencyFormatter } from 'src/client/shared/utils'
import { useQuery } from 'react-query'

type InvoiceSummary = {
  id: string
  paymentDue: Date
  clientName: string
  total: number
  status: 'draft' | 'pending' | 'paid'
}

async function getInvoices(): Promise<Array<InvoiceSummary>> {
  const res = await fetch('/api/invoices')
  const { data } = (await res.json()) as ResponseStringify<GetInvoiceSummary>
  return data.invoices.map(({ paymentDue, ...invoice }) => ({
    ...invoice,
    paymentDue: parseJSON(paymentDue),
  }))
}

export function InvoiceSummaryScreen(): JSX.Element {
  const query = useQuery(['invoices'], getInvoices)
  return (
    <>
      <h1>Invoices</h1>
      {query.isLoading ? <div>Loading...</div> : null}
      {query.isSuccess ? (
        <List
          collection={query.data}
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
    </>
  )
}

type ListProps<T> = {
  collection: Array<T>
  renderItem: (item: T, index: number, collection: Array<T>) => JSX.Element
  emptyState: JSX.Element
}

function List<T>({ collection, renderItem, emptyState }: ListProps<T>) {
  return collection.length > 0 ? (
    <ul>{collection.map(renderItem)}</ul>
  ) : (
    emptyState
  )
}

type InvoiceSummaryItemProps = {
  invoice: InvoiceSummary
}

function InvoiceSummaryItem({ invoice }: InvoiceSummaryItemProps) {
  return (
    <li>
      <Link href={`/invoices/${invoice.id}`}>
        <a>{invoice.id}</a>
      </Link>
      <div>{`Due ${format(invoice.paymentDue, 'dd MMM yyyy')}`}</div>
      <div>{invoice.clientName}</div>
      <div>{currencyFormatter.format(invoice.total / 100)}</div>
      <div>{invoice.status}</div>
    </li>
  )
}
