import {
  Address as AddressType,
  InvoiceDetail,
} from 'src/client/features/invoice/invoice.types'
import {
  Button,
  CurrencyValue,
  Drawer,
  Stack,
  StatusBadge,
  useConfirmationDialog,
  useDrawer,
  useScreenReaderNotification,
} from 'src/client/shared/components'
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
  main,
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
  useUpdateInvoice,
} from './invoice.queries'

import { ArrowLeft } from 'src/client/shared/icons'
import { Except } from 'type-fest'
import { InvoiceForm } from './invoice-form'
import { ReactNode } from 'hoist-non-react-statics/node_modules/@types/react'
import { UpdateInvoiceRequest } from 'src/shared/dtos'
import { format } from 'date-fns'
import { useCallback } from 'react'
import { useRouter } from 'next/router'

type Props = {
  id: InvoiceDetail['id']
}

type EditableInvoice = Except<InvoiceDetail, 'status'> & {
  status: Exclude<InvoiceDetail['status'], 'paid'>
}
function editableInvoiceFromInvoiceDetail(
  invoice: InvoiceDetail
): EditableInvoice | null {
  switch (invoice.status) {
    case 'draft':
      return { ...invoice, status: 'draft' as const }
    case 'pending':
      return { ...invoice, status: 'pending' as const }
    case 'paid':
      return null
  }
}

type Action = 'edit' | 'delete' | 'markAsPaid'
const allowedActions: Record<InvoiceDetail['status'], Action[]> = {
  draft: ['edit', 'delete'],
  pending: ['edit', 'delete', 'markAsPaid'],
  paid: [],
}

export function InvoiceDetailScreen({ id }: Props): JSX.Element {
  const { openDialog } = useConfirmationDialog()
  const { notify } = useScreenReaderNotification()
  const invoiceDetailQuery = useInvoiceDetail(id)
  const markAsPaidMutation = useMarkAsPaid({
    onSuccess: (updatedInvoice) => {
      notify(`Invoice id ${updatedInvoice.id} successfully marked as paid`)
    },
  })

  function handleOpenDeleteConfirmation() {
    openDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete invoice #${id}? This action cannot be undone.`,
      actionLabel: 'Delete',
      onConfirm: () => deleteInvoiceMutation.mutate(id),
    })
  }

  const router = useRouter()

  const deleteInvoiceMutation = useDeleteInvoice({
    onMutate: () => {
      router.push('/')
    },
    onSuccess: (deletedInvoice) => {
      notify(`Invoice id ${deletedInvoice.id} successfully deleted`)
    },
  })

  const drawer = useDrawer()
  const updateInvoiceMutation = useUpdateInvoice({
    onSuccess: (savedInvoice) => {
      notify(`Invoice id ${savedInvoice.id} successfully updated`)
    },
  })

  const handleEditFormSubmit = useCallback(
    (data: UpdateInvoiceRequest) => {
      updateInvoiceMutation.mutate({ id, invoice: data })
      drawer.close()
    },
    [drawer, id, updateInvoiceMutation]
  )

  if (invoiceDetailQuery.isLoading) return <div>Loading...</div>
  if (invoiceDetailQuery.isSuccess) {
    const invoice = invoiceDetailQuery.data
    const editableInvoice = editableInvoiceFromInvoiceDetail(invoice)
    return (
      <Stack size="2" component="main" className={main}>
        <BackButton />

        <div className={statusBar}>
          <div className={status}>
            Status
            <StatusBadge status={invoice.status} />
          </div>
          <AllowedAction action="edit" status={invoice.status}>
            <Button color="muted" onClick={drawer.open}>
              Edit
            </Button>
          </AllowedAction>
          <AllowedAction action="delete" status={invoice.status}>
            <Button color="warning" onClick={handleOpenDeleteConfirmation}>
              Delete
            </Button>
          </AllowedAction>
          <AllowedAction action="markAsPaid" status={invoice.status}>
            <Button
              color="primary"
              onClick={() => markAsPaidMutation.mutate(id)}
            >
              Mark as Paid
            </Button>
          </AllowedAction>
        </div>
        <Stack size="5" className={details}>
          <div className={grid}>
            <Stack size="-1" component="section" className={twoColumns}>
              <h1 className={invoiceId}>{invoice.id}</h1>
              <p>{invoice.projectDescription}</p>
            </Stack>
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
              <Stack size="-1" component="section">
                <h2 className={sectionHeader}>Invoice Date</h2>
                <p className={primaryValue}>
                  {format(invoice.issuedAt, 'dd MMM yyyy')}
                </p>
              </Stack>
              <Stack size="-1" component="section">
                <h2 className={sectionHeader}>Payment Due</h2>
                <p className={primaryValue}>
                  {format(invoice.paymentDue, 'dd MMM yyyy')}
                </p>
              </Stack>
            </div>
            <Stack size="-1" component="section">
              <h2 className={sectionHeader}>Bill To</h2>
              <p className={primaryValue} style={{ marginBottom: '8px' }}>
                {invoice.clientName}
              </p>
              <Address address={invoice.clientAddress} />
            </Stack>
            <Stack size="-1" component="section">
              <h2 className={sectionHeader}>Sent To</h2>
              <p className={primaryValue}>{invoice.clientEmail}</p>
            </Stack>
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
                    <CurrencyValue value={item.price} />
                  </td>
                  <td className={bodyCell}>
                    <CurrencyValue value={item.total} />
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
                  <CurrencyValue value={invoice.amountDue} />
                </td>
              </tr>
            </tfoot>
          </table>
        </Stack>

        {editableInvoice !== null ? (
          <Drawer>
            <InvoiceForm
              kind="update"
              heading={
                <h2 id={drawer.titleId}>
                  Edit <span className={invoiceId}>{invoice.id}</span>
                </h2>
              }
              defaultValues={editableInvoice}
              aria-labelledby={drawer.titleId}
              onCancel={drawer.close}
              onSubmit={handleEditFormSubmit}
            />
          </Drawer>
        ) : null}
      </Stack>
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

function BackButton() {
  const router = useRouter()

  return (
    <button className={backButton} onClick={router.back}>
      <ArrowLeft className={backButtonIcon} />
      Go back
    </button>
  )
}

type AllowedActionProps = {
  action: Action
  status: InvoiceDetail['status']
  children: ReactNode
}
function AllowedAction({
  action,
  children,
  status,
}: AllowedActionProps): JSX.Element {
  const canPerformAction = allowedActions[status].includes(action)

  return canPerformAction ? <>{children}</> : <></>
}
