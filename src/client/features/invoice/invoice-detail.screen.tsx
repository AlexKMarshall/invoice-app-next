import {
  Address as AddressType,
  InvoiceDetail,
} from 'src/client/features/invoice/invoice.types'
import {
  addressWrapper,
  backButton,
  backButtonIcon,
  bodyCell,
  details,
  grid,
  headingCell,
  invoiceId,
  itemTable,
  primaryValue,
  sectionHeader,
  status,
  statusBar,
  tbody,
  tfoot,
  thead,
  totalHeader,
  totalValue,
  twoColumns,
} from './invoice-detail.screen.css'
import { useInvoiceDetail, useMarkAsPaid } from './invoice.queries'

import { ArrowLeft } from 'src/client/shared/icons/arrow-left'
import { Button } from 'src/client/shared/components/button'
import { StatusBadge } from 'src/client/shared/components/status-badge'
import { currencyFormatterGBP } from 'src/client/shared/currency'
import { format } from 'date-fns'
import { screenReaderOnly } from 'src/client/shared/styles/accessibility.css'
import { useRouter } from 'next/router'
import { useState } from 'react'

type Props = {
  id: InvoiceDetail['id']
}

export function InvoiceDetailScreen({ id }: Props): JSX.Element {
  const invoiceDetailQuery = useInvoiceDetail(id)
  const [notificationMessage, setNotificationMessage] = useState('')
  const markAsPaidMutation = useMarkAsPaid({
    onSuccess: (updatedInvoice) => {
      setNotificationMessage(
        `Invoice id ${updatedInvoice.id} successfully marked as paid`
      )
    },
  })

  if (invoiceDetailQuery.isLoading) return <div>Loading...</div>
  if (invoiceDetailQuery.isSuccess) {
    const invoice = invoiceDetailQuery.data
    const canMarkAsPaid = invoice.status === 'pending'
    return (
      <>
        <BackButton />
        <div className={statusBar}>
          <div className={status}>
            Status
            <StatusBadge status={invoice.status} />
          </div>
          {canMarkAsPaid ? (
            <Button
              color="primary"
              onClick={() => markAsPaidMutation.mutate(id)}
            >
              Mark as Paid
            </Button>
          ) : null}
        </div>
        <div className={details}>
          <div className={grid}>
            <section className={twoColumns}>
              <h1 className={invoiceId}>{invoice.id}</h1>
              <p>{invoice.projectDescription}</p>
            </section>
            <section>
              <Address address={invoice.senderAddress} align="right" />
            </section>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <section>
                <h2 className={sectionHeader}>Invoice Date</h2>
                <p className={primaryValue}>
                  {format(invoice.issuedAt, 'dd MMM yyyy')}
                </p>
              </section>
              <section>
                <h2 className={sectionHeader}>Payment Due</h2>
                <p className={primaryValue}>
                  {format(invoice.paymentDue, 'dd MMM yyyy')}
                </p>
              </section>
            </div>
            <section>
              <h2 className={sectionHeader}>Bill To</h2>
              <p className={primaryValue} style={{ marginBottom: '8px' }}>
                {invoice.clientName}
              </p>
              <Address address={invoice.clientAddress} />
            </section>
            <section>
              <h2 className={sectionHeader}>Sent To</h2>
              <p className={primaryValue}>{invoice.clientEmail}</p>
            </section>
          </div>
          <table className={itemTable}>
            <thead className={thead}>
              <tr>
                <th className={headingCell}>Item Name</th>
                <th className={headingCell}>QTY.</th>
                <th className={headingCell}>Price</th>
                <th className={headingCell}>Total</th>
              </tr>
            </thead>
            <tbody className={tbody}>
              {invoice.itemList.map((item) => (
                <tr key={item.id}>
                  <td className={bodyCell}>{item.name}</td>
                  <td className={bodyCell}>{item.quantity}</td>
                  <td className={bodyCell}>
                    <GBPValue value={item.price} />
                  </td>
                  <td className={bodyCell}>
                    <GBPValue value={item.total} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className={tfoot}>
              <tr>
                <th scope="row" colSpan={2} className={totalHeader}>
                  Amount Due
                </th>
                <td colSpan={2} className={totalValue}>
                  <GBPValue value={invoice.amountDue} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div role="status" aria-live="polite" className={screenReaderOnly}>
          {notificationMessage}
        </div>
      </>
    )
  }
  return <></>
}

type AddressProps = {
  address: AddressType
  align?: 'left' | 'right'
}
function Address({ address, align = 'left' }: AddressProps): JSX.Element {
  return (
    <p className={addressWrapper({ align })}>
      <span>{address.street}</span>
      <br />
      <span>{address.city}</span>
      <br />
      <span>{address.postcode}</span>
      <br />
      <span>{address.country}</span>
    </p>
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

function BackButton() {
  const router = useRouter()

  return (
    <button className={backButton} onClick={router.back}>
      <ArrowLeft className={backButtonIcon} />
      Go back
    </button>
  )
}
