import { ChangeEvent, useMemo, useState } from 'react'
import { GetInvoiceSummary, ResponseStringify } from 'src/shared/dtos'
import { format, parseJSON } from 'date-fns'

import Link from 'next/link'
import { currencyFormatter } from 'src/client/shared/utils'
import { useId } from '@react-aria/utils'
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

function useControlledItemQuantity() {
  const [value, setValue] = useState(0)

  const props = useMemo(
    () => ({
      quantity: value,
      value: value.toString(),
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value
        const numericValue = parseInt(rawValue || '0')
        if (Number.isNaN(numericValue)) return
        setValue(numericValue)
      },
    }),
    [value]
  )

  return props
}
function useControlledItemPrice() {
  const [penceValue, setPenceValue] = useState(0)
  const poundsValue = penceValue / 100

  const props = useMemo(
    () => ({
      penceValue,
      value: poundsValue.toString(),
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value
        const valueInPence = Math.floor(parseFloat(rawValue || '0') * 100)

        if (Number.isNaN(valueInPence)) return
        setPenceValue(valueInPence)
      },
    }),
    [penceValue, poundsValue]
  )

  return props
}

export function InvoiceSummaryScreen(): JSX.Element {
  const query = useQuery(['invoices'], getInvoices)
  const formHeadingId = useId()
  const billFromHeadingId = useId()
  const billToHeadingId = useId()
  const itemListHeadingId = useId()
  const { quantity, ...controlledItemQuantity } = useControlledItemQuantity()
  const { penceValue, ...controlledItemPrice } = useControlledItemPrice()
  const totalCost = (quantity * penceValue) / 100
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
      <form
        aria-labelledby={formHeadingId}
        onSubmit={(event) => {
          event.preventDefault()
          console.log('submitting')
        }}
      >
        <h2 id={formHeadingId}>New Invoice</h2>
        <section aria-labelledby={billFromHeadingId}>
          <h3 id={billFromHeadingId}>Bill From</h3>
          <label>
            <span>Street Address</span>
            <input type="text" />
          </label>
          <label>
            <span>City</span>
            <input type="text" />
          </label>
          <label>
            <span>Post Code</span>
            <input type="text" />
          </label>
          <label>
            <span>Country</span>
            <input type="text" />
          </label>
        </section>
        <section aria-labelledby={billToHeadingId}>
          <h3 id={billToHeadingId}>Bill To</h3>
          <label>
            <span>Street Address</span>
            <input type="text" />
          </label>
          <label>
            <span>City</span>
            <input type="text" />
          </label>
          <label>
            <span>Post Code</span>
            <input type="text" />
          </label>
          <label>
            <span>Country</span>
            <input type="text" />
          </label>
        </section>
        <section>
          <label>
            <span>Issue Date</span>
            <input type="date" />
          </label>
          <label>
            <span>Payment Terms</span>
            <input type="text" />
          </label>
          <label>
            <span>Project Description</span>
            <input type="text" />
          </label>
        </section>
        <section aria-labelledby={itemListHeadingId}>
          <h3 id={itemListHeadingId}>Item List</h3>
          <label>
            <span>Item Name</span>
            <input type="text" />
          </label>
          <label>
            <span>Qty.</span>
            <input type="number" {...controlledItemQuantity} />
          </label>
          <label>
            <span>Price</span>
            <input type="number" step="0.01" {...controlledItemPrice} />
          </label>
          <label>
            <span>Total</span>
            <input type="number" step="0.01" value={totalCost} readOnly />
          </label>
        </section>
        <button type="submit">Save as Draft</button>
      </form>
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
