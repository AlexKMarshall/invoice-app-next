import * as invoiceModel from 'src/client/test/mocks/invoice.model'

import {
  buildMockInvoiceDetail,
  buildMockPendingInvoiceInput,
} from 'src/client/test/mocks/invoice.fixtures'
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react'
import { validateGBPValue, validateTextIfNonEmpty } from '../validators'

import { InvoiceDetail } from 'src/client/features/invoice/invoice.types'
import { buildMockDraftInvoiceInput } from 'src/server/test/mocks/invoice.fixtures'
import { fillInInvoiceForm } from 'src/client/test/test-utils'
import { format } from 'date-fns'
import { getPage } from 'next-page-tester'
import { idRegex } from 'src/shared/identifier'
import { invoiceDetailFromInput } from 'src/client/features/invoice/invoice.mappers'
import { randomPick } from 'src/shared/random'
import userEvent from '@testing-library/user-event'

it('should show invoice details', async () => {
  const mockInvoice = buildMockInvoiceDetail()
  invoiceModel.initialise([mockInvoice])

  const { render } = await getPage({
    route: `/invoices/${mockInvoice.id}`,
  })

  render()

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

  validateInvoiceDetailInformation(mockInvoice)
})
it('should allow pending invoices to be marked as paid', async () => {
  const mockInvoice = buildMockInvoiceDetail({ status: 'pending' })
  invoiceModel.initialise([mockInvoice])

  const { render } = await getPage({
    route: `/invoices/${mockInvoice.id}`,
  })

  render()

  await screen.findByText(/pending/i)

  userEvent.click(screen.getByRole('button', { name: /mark as paid/i }))

  const elNotificationArea = screen.getByRole('status')

  await waitFor(() =>
    expect(elNotificationArea).toHaveTextContent(
      new RegExp(
        `invoice id ${idRegex.source} successfully marked as paid`,
        'i'
      )
    )
  )

  // we don't see the button once it's already paid
  expect(
    screen.queryByRole('button', { name: /mark as paid/i })
  ).not.toBeInTheDocument()
  // check nothing else has changed except the invoice status
  validateInvoiceDetailInformation({ ...mockInvoice, status: 'paid' })
})
it('should not show mark as paid button if invoice is draft', async () => {
  const mockInvoice = buildMockInvoiceDetail({ status: 'draft' })
  invoiceModel.initialise([mockInvoice])

  const { render } = await getPage({
    route: `/invoices/${mockInvoice.id}`,
  })

  render()

  await screen.findByText(/draft/i)

  expect(
    screen.queryByRole('button', { name: /mark as paid/i })
  ).not.toBeInTheDocument()
})
it('should allow pending invoices to be edited', async () => {
  const initialPendingInvoice = buildMockInvoiceDetail({ status: 'pending' })

  invoiceModel.initialise([initialPendingInvoice])

  // generate a new set of invoice data
  const updatedInvoiceInput = buildMockPendingInvoiceInput()
  const updatedInvoiceDetail = invoiceDetailFromInput(
    updatedInvoiceInput,
    initialPendingInvoice.id
  )

  const { render } = await getPage({
    route: `/invoices/${initialPendingInvoice.id}`,
  })
  render()

  userEvent.click(await screen.findByRole('button', { name: /edit/i }))

  expect(
    screen.getByRole('heading', { name: `Edit ${initialPendingInvoice.id}` })
  ).toBeInTheDocument()

  fillInInvoiceForm(updatedInvoiceInput)

  userEvent.click(screen.getByRole('button', { name: /save changes/i }))

  await waitForElementToBeRemoved(
    screen.getByRole('heading', { name: `Edit ${initialPendingInvoice.id}` })
  )

  validateInvoiceDetailInformation(updatedInvoiceDetail)

  const elNotificationArea = screen.getByRole('status')

  await waitFor(() =>
    expect(elNotificationArea).toHaveTextContent(
      `Invoice id ${initialPendingInvoice.id} successfully updated`
    )
  )
})
it('should convert draft invoices to pending on edit so long as every field valid', async () => {
  const initialDraftInvoice = buildMockInvoiceDetail({ status: 'draft' })

  invoiceModel.initialise([initialDraftInvoice])

  // generate a new set of invoice data, we use the pending builder here just to ensure every field filled in
  const updatedInvoiceInput = {
    ...buildMockPendingInvoiceInput(),
    status: 'draft' as const,
  }
  const updatedInvoiceDetail = invoiceDetailFromInput(
    updatedInvoiceInput,
    initialDraftInvoice.id
  )

  const { render } = await getPage({
    route: `/invoices/${initialDraftInvoice.id}`,
  })
  render()

  userEvent.click(await screen.findByRole('button', { name: /edit/i }))

  expect(
    screen.getByRole('heading', { name: `Edit ${initialDraftInvoice.id}` })
  ).toBeInTheDocument()

  fillInInvoiceForm(updatedInvoiceInput)

  userEvent.click(screen.getByRole('button', { name: /save changes/i }))

  await waitForElementToBeRemoved(
    screen.getByRole('heading', { name: `Edit ${initialDraftInvoice.id}` })
  )

  // it should show the updated invoice as pending
  validateInvoiceDetailInformation({
    ...updatedInvoiceDetail,
    status: 'pending',
  })

  const elNotificationArea = screen.getByRole('status')

  await waitFor(() =>
    expect(elNotificationArea).toHaveTextContent(
      `Invoice id ${initialDraftInvoice.id} successfully updated`
    )
  )
})
it('should not allow saving an update to draft invoice if not everything is filled in', async () => {
  const initialDraftInvoice = buildMockInvoiceDetail({ status: 'draft' })

  invoiceModel.initialise([initialDraftInvoice])

  // generate a new set of invoice data, making sure some is empty
  const updatedInvoiceInput = buildMockDraftInvoiceInput({ clientName: '' })

  const { render } = await getPage({
    route: `/invoices/${initialDraftInvoice.id}`,
  })
  render()

  userEvent.click(await screen.findByRole('button', { name: /edit/i }))

  expect(
    screen.getByRole('heading', { name: `Edit ${initialDraftInvoice.id}` })
  ).toBeInTheDocument()

  fillInInvoiceForm(updatedInvoiceInput)

  const clientNameField = screen.getByRole('textbox', {
    name: /client's name/i,
  })

  userEvent.click(screen.getByRole('button', { name: /save changes/i }))

  // We have to wait for the field to be invalid as react hook form validation is async
  await waitFor(() => expect(clientNameField).toBeInvalid())

  // bit hacky - see if any of the alerts have a can't be empty message
  // can't simply query by Role with a given message
  const alerts = screen.getAllByRole('alert')
  const alertContents = alerts.map((alert) => alert.textContent)
  expect(alertContents).toIncludeAnyMembers(["can't be empty"])
})
it('should not show edit button for paid invoices', async () => {
  const paidInvoice = buildMockInvoiceDetail({ status: 'paid' })

  invoiceModel.initialise([paidInvoice])

  const { render } = await getPage({
    route: `/invoices/${paidInvoice.id}`,
  })

  render()

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

  expect(
    screen.queryByRole('button', { name: /edit/i })
  ).not.toBeInTheDocument()
})
it('should allow pending or draft invoices to be deleted', async () => {
  const mockInvoice = buildMockInvoiceDetail({
    status: randomPick(['draft', 'pending']),
  })

  invoiceModel.initialise([mockInvoice])

  const { render } = await getPage({
    route: `/invoices/${mockInvoice.id}`,
  })

  render()

  userEvent.click(await screen.findByRole('button', { name: /delete/i }))

  const deleteDialog = screen.getByRole('dialog', { name: /confirm delete/i })

  const deleteMessage = within(deleteDialog).getByText(
    /are you sure you want to delete/i
  )

  expect(deleteMessage).toHaveTextContent(
    `Are you sure you want to delete invoice #${mockInvoice.id}? This action cannot be undone.`
  )

  // This is the delete confirmation button. RTL shouldn't be confused between this
  // and the previous one as the other is hidden behind modal overlay
  userEvent.click(screen.getByRole('button', { name: /delete/i }))

  // after we delete an invoice we should go back to the main invoices page
  await screen.findByRole('heading', { name: /invoices/i })

  const elNotificationArea = screen.getByRole('status')

  await waitFor(() =>
    expect(elNotificationArea).toHaveTextContent(
      new RegExp(`invoice id ${idRegex.source} successfully deleted`, 'i')
    )
  )
})
it('should not show delete button for paid invoices', async () => {
  const paidInvoice = buildMockInvoiceDetail({
    status: 'paid',
  })

  invoiceModel.initialise([paidInvoice])

  const { render } = await getPage({
    route: `/invoices/${paidInvoice.id}`,
  })

  render()

  await waitForElementToBeRemoved(screen.getByText(/loading/i))

  expect(
    screen.queryByRole('button', { name: /delete/i })
  ).not.toBeInTheDocument()
})
it('should allow delete dialog to be cancelled', async () => {
  const mockInvoice = buildMockInvoiceDetail({
    status: randomPick(['draft', 'pending']),
  })

  invoiceModel.initialise([mockInvoice])

  const { render } = await getPage({
    route: `/invoices/${mockInvoice.id}`,
  })

  render()

  userEvent.click(await screen.findByRole('button', { name: /delete/i }))

  const deleteDialog = screen.getByRole('dialog', { name: /confirm delete/i })

  userEvent.click(within(deleteDialog).getByRole('button', { name: /cancel/i }))

  expect(
    screen.queryByRole('heading', { name: /confirm delete/i })
  ).not.toBeInTheDocument()

  expect(screen.getByText(mockInvoice.id)).toBeInTheDocument()
})

it.todo('should handle fetch errors')

function validateInvoiceDetailInformation(invoice: InvoiceDetail) {
  expect(screen.getByText(invoice.status)).toBeInTheDocument()

  expect(screen.getByText(invoice.id)).toBeInTheDocument()
  validateTextIfNonEmpty(invoice.projectDescription)

  validateTextIfNonEmpty(invoice.senderAddress.street)
  validateTextIfNonEmpty(invoice.senderAddress.city)
  validateTextIfNonEmpty(invoice.senderAddress.postcode)
  validateTextIfNonEmpty(invoice.senderAddress.country)

  expect(
    screen.getByText(format(invoice.issuedAt, 'dd MMM yyyy'))
  ).toBeInTheDocument()
  expect(
    screen.getByText(format(invoice.paymentDue, 'dd MMM yyyy'))
  ).toBeInTheDocument()

  validateTextIfNonEmpty(invoice.clientName)
  validateTextIfNonEmpty(invoice.clientAddress.street)
  validateTextIfNonEmpty(invoice.clientAddress.city)
  validateTextIfNonEmpty(invoice.clientAddress.postcode)
  validateTextIfNonEmpty(invoice.clientAddress.country)
  validateTextIfNonEmpty(invoice.clientEmail)

  const allRows = screen.getAllByRole('row')
  const [headerRow] = allRows
  const itemRows = allRows.slice(1, -1)
  const [footerRow] = allRows.slice(-1)

  const columnHeaders = within(headerRow).getAllByRole('columnheader')
  const itemNameHeader = within(headerRow).getByRole('columnheader', {
    name: /item name/i,
  })
  const itemNameIndex = columnHeaders.indexOf(itemNameHeader)
  const itemQtyHeader = within(headerRow).getByRole('columnheader', {
    name: /qty\./i,
  })
  const itemQtyIndex = columnHeaders.indexOf(itemQtyHeader)
  const itemPriceHeader = within(headerRow).getByRole('columnheader', {
    name: /price/i,
  })
  const itemPriceIndex = columnHeaders.indexOf(itemPriceHeader)
  const itemTotalHeader = within(headerRow).getByRole('columnheader', {
    name: /total/i,
  })
  const itemTotalIndex = columnHeaders.indexOf(itemTotalHeader)

  expect(itemRows).toHaveLength(invoice.itemList.length)

  invoice.itemList.forEach((mockItem, index) => {
    const itemRow = itemRows[index]
    const rowCells = within(itemRow).getAllByRole('cell')

    validateTextIfNonEmpty(mockItem.name, within(rowCells[itemNameIndex]))
    validateTextIfNonEmpty(
      mockItem.quantity.toString(),
      within(rowCells[itemQtyIndex])
    )
    validateGBPValue(mockItem.price, within(rowCells[itemPriceIndex]))
    validateGBPValue(mockItem.total, within(rowCells[itemTotalIndex]))
  })

  validateGBPValue(invoice.amountDue, within(footerRow))
}
