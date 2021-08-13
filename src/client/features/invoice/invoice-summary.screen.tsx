import { GetInvoiceSummary, ResponseStringify } from 'src/shared/dtos'
import { format, parseJSON } from 'date-fns'

import Link from 'next/link'
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

export function InvoiceSummaryScreen() {
  const query = useQuery(['invoices'], getInvoices)
  return (
    <>
      <h1>Invoices</h1>
      {query.isLoading ? <div>Loading...</div> : null}
      {query.isSuccess ? (
        <ul>
          {query.data.map((invoice) => (
            <InvoiceSummaryItem key={invoice.id} invoice={invoice} />
          ))}
        </ul>
      ) : null}
    </>
  )
}

type InvoiceSummaryItemProps = {
  invoice: InvoiceSummary
}

function InvoiceSummaryItem({ invoice }: InvoiceSummaryItemProps) {
  const id = useId()
  return (
    <li aria-labelledby={id}>
      <Link href={`/invoices/${invoice.id}`}>
        <a id={id}>{invoice.id}</a>
      </Link>
      <div>{`Due ${format(invoice.paymentDue, 'dd MMM yyyy')}`}</div>
      <div>{invoice.clientName}</div>
      <div>{invoice.total}</div>
      <div>{invoice.status}</div>
    </li>
  )
}
