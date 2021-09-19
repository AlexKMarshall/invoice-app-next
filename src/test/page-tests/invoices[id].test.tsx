import * as invoiceModel from 'src/client/test/mocks/invoice.model'

import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react'
import { validateGBPValue, validateTextIfNonEmpty } from '../validators'

import { buildMockInvoiceDetail } from 'src/client/test/mocks/invoice.fixtures'
import { format } from 'date-fns'
import { getPage } from 'next-page-tester'
import { idRegex } from 'src/shared/identifier'
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

  expect(screen.getByText(mockInvoice.status)).toBeInTheDocument()

  expect(screen.getByText(mockInvoice.id)).toBeInTheDocument()
  validateTextIfNonEmpty(mockInvoice.projectDescription)

  validateTextIfNonEmpty(mockInvoice.senderAddress.street)
  validateTextIfNonEmpty(mockInvoice.senderAddress.city)
  validateTextIfNonEmpty(mockInvoice.senderAddress.postcode)
  validateTextIfNonEmpty(mockInvoice.senderAddress.country)

  expect(
    screen.getByText(format(mockInvoice.issuedAt, 'dd MMM yyyy'))
  ).toBeInTheDocument()
  expect(
    screen.getByText(format(mockInvoice.paymentDue, 'dd MMM yyyy'))
  ).toBeInTheDocument()

  validateTextIfNonEmpty(mockInvoice.clientName)
  validateTextIfNonEmpty(mockInvoice.clientAddress.street)
  validateTextIfNonEmpty(mockInvoice.clientAddress.city)
  validateTextIfNonEmpty(mockInvoice.clientAddress.postcode)
  validateTextIfNonEmpty(mockInvoice.clientAddress.country)
  validateTextIfNonEmpty(mockInvoice.clientEmail)

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

  expect(itemRows).toHaveLength(mockInvoice.itemList.length)

  mockInvoice.itemList.forEach((mockItem, index) => {
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

  validateGBPValue(mockInvoice.amountDue, within(footerRow))
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

it.todo('should handle fetch errors')
