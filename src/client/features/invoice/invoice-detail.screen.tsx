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
import {
  useDeleteInvoice,
  useInvoiceDetail,
  useMarkAsPaid,
} from './invoice.queries'

import { ArrowLeft } from 'src/client/shared/icons/arrow-left'
import { Button } from 'src/client/shared/components/button'
import { Dialog } from 'src/client/shared/components/dialog'
import { OverlayContainer } from '@react-aria/overlays'
import { StatusBadge } from 'src/client/shared/components/status-badge'
import { currencyFormatterGBP } from 'src/client/shared/currency'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { useScreenReaderNotification } from 'src/client/shared/components/screen-reader-notification'
import { useState } from 'react'

type Props = {
  id: InvoiceDetail['id']
}

export function InvoiceDetailScreen({ id }: Props): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { notify } = useScreenReaderNotification()
  const invoiceDetailQuery = useInvoiceDetail(id)
  const markAsPaidMutation = useMarkAsPaid({
    onSuccess: (updatedInvoice) => {
      notify(`Invoice id ${updatedInvoice.id} successfully marked as paid`)
    },
  })

  const router = useRouter()

  const deleteInvoiceMutation = useDeleteInvoice({
    onMutate: () => {
      router.push('/')
    },
    onSuccess: (deletedInvoice) => {
      notify(`Invoice id ${deletedInvoice.id} successfully deleted`)
    },
  })

  if (invoiceDetailQuery.isLoading) return <div>Loading...</div>
  if (invoiceDetailQuery.isSuccess) {
    const invoice = invoiceDetailQuery.data
    const canMarkAsPaid = invoice.status === 'pending'
    const canDelete = ['draft', 'pending'].includes(invoice.status)
    return (
      <>
        <BackButton />
        <div className={statusBar}>
          <div className={status}>
            Status
            <StatusBadge status={invoice.status} />
          </div>
          {canDelete ? (
            <Button color="warning" onClick={() => setIsDialogOpen(true)}>
              Delete
            </Button>
          ) : null}
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
        {isDialogOpen ? (
          <OverlayContainer>
            <Dialog
              title="Confirm Delete"
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              isDismissable
            >
              <p>{`Are you sure you want to delete invoice #${invoice.id}? This action cannot be undone.`}</p>
              <Button color="muted" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                color="warning"
                onClick={() => deleteInvoiceMutation.mutate(invoice.id)}
              >
                Delete
              </Button>
            </Dialog>
          </OverlayContainer>
        ) : null}
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
