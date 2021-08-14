import { InvoiceDetail, InvoiceSummary } from './invoice.types'
import { useCreateInvoice, useInvoiceSummaries } from './invoice.queries'

import Link from 'next/link'
import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { currencyFormatter } from 'src/client/shared/utils'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { useId } from '@react-aria/utils'
import { useState } from 'react'

export function InvoiceSummaryScreen(): JSX.Element {
  const listQuery = useInvoiceSummaries()
  const [notificationMessage, setNotificationMessage] = useState('')

  return (
    <>
      <h1>Invoices</h1>
      {listQuery.isLoading ? <div>Loading...</div> : null}
      {listQuery.isSuccess ? (
        <List
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
      <CreateNewInvoiceForm
        onSubmitSuccess={(savedInvoice) => {
          setNotificationMessage(
            `New invoice id ${savedInvoice.id} successfully created`
          )
        }}
      />
      <div role="status" aria-live="polite">
        {notificationMessage}
      </div>
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

type NewInvoiceFormFields = Omit<NewInvoiceInputDTO, 'status'>

const DEFAULT_FORM_VALUES = {
  senderAddress: {
    street: '',
    city: '',
    postcode: '',
    country: '',
  },
  clientName: '',
  clientEmail: '',
  clientAddress: {
    street: '',
    city: '',
    postcode: '',
    country: '',
  },
  issuedAt: format(new Date(), 'yyyy-MM-dd') ?? '',
  paymentTerms: 0,
  projectDescription: '',
  itemList: [{ name: '', quantity: 0, price: 0 }],
}

type CreateNewInvoiceFormProps = {
  onSubmitSuccess?: (data: InvoiceDetail) => void
}

function CreateNewInvoiceForm({ onSubmitSuccess }: CreateNewInvoiceFormProps) {
  const createInvoiceMutation = useCreateInvoice({
    onSuccess: (savedInvoice) => {
      onSubmitSuccess?.(savedInvoice)
    },
  })
  const formHeadingId = useId()
  const billFromHeadingId = useId()
  const billToHeadingId = useId()
  const itemListHeadingId = useId()
  const { register, handleSubmit, watch } = useForm<NewInvoiceFormFields>({
    defaultValues: DEFAULT_FORM_VALUES,
  })
  const quantity = watch('itemList.0.quantity')
  const price = watch('itemList.0.price')
  const total = quantity * price

  return (
    <form
      aria-labelledby={formHeadingId}
      onSubmit={handleSubmit((data) => {
        createInvoiceMutation.mutate({ status: 'draft', ...data })
      })}
    >
      <h2 id={formHeadingId}>New Invoice</h2>
      <section aria-labelledby={billFromHeadingId}>
        <h3 id={billFromHeadingId}>Bill From</h3>
        <label>
          <span>Street Address</span>
          <input type="text" {...register('senderAddress.street')} />
        </label>
        <label>
          <span>City</span>
          <input type="text" {...register('senderAddress.city')} />
        </label>
        <label>
          <span>Post Code</span>
          <input type="text" {...register('senderAddress.postcode')} />
        </label>
        <label>
          <span>Country</span>
          <input type="text" {...register('senderAddress.country')} />
        </label>
      </section>
      <section aria-labelledby={billToHeadingId}>
        <h3 id={billToHeadingId}>Bill To</h3>
        <label>
          <span>Client&apos;s Name</span>
          <input type="text" {...register('clientName')} />
        </label>
        <label>
          <span>Client&apos;s Email</span>
          <input type="text" {...register('clientEmail')} />
        </label>
        <label>
          <span>Street Address</span>
          <input type="text" {...register('clientAddress.street')} />
        </label>
        <label>
          <span>City</span>
          <input type="text" {...register('clientAddress.city')} />
        </label>
        <label>
          <span>Post Code</span>
          <input type="text" {...register('clientAddress.postcode')} />
        </label>
        <label>
          <span>Country</span>
          <input type="text" {...register('clientAddress.country')} />
        </label>
      </section>
      <section>
        <label>
          <span>Issue Date</span>
          <input
            type="date"
            {...register('issuedAt', {
              valueAsDate: true,
            })}
          />
        </label>
        <label>
          <span>Payment Terms</span>
          <input
            type="number"
            {...register('paymentTerms', { valueAsNumber: true })}
          />
        </label>
        <label>
          <span>Project Description</span>
          <input type="text" {...register('projectDescription')} />
        </label>
      </section>
      <section aria-labelledby={itemListHeadingId}>
        <h3 id={itemListHeadingId}>Item List</h3>
        <label>
          <span>Item Name</span>
          <input type="text" {...register('itemList.0.name')} />
        </label>
        <label>
          <span>Qty.</span>
          <input
            type="number"
            {...register('itemList.0.quantity', {
              valueAsNumber: true,
            })}
          />
        </label>
        <label>
          <span>Price</span>
          <input
            type="number"
            {...register('itemList.0.price', { valueAsNumber: true })}
          />
        </label>
        <div>
          <span id="item-total">Total</span>
          <div aria-labelledby="item-total">{total}</div>
        </div>
      </section>
      <button type="submit">Save as Draft</button>
    </form>
  )
}
