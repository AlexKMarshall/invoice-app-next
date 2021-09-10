import * as invoiceModel from 'src/client/test/mocks/invoice.model'

import {
  BoundFunctions,
  queries,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react'

import { buildMockInvoiceDetail } from 'src/client/test/mocks/invoice.fixtures'
import { format } from 'date-fns'
import { getPage } from 'next-page-tester'

it('should show invoice details', async () => {
  const mockInvoice = buildMockInvoiceDetail()
  invoiceModel.initialise([mockInvoice])

  const { render } = await getPage({
    route: `/invoices/${mockInvoice.id}`,
  })

  render()

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

  expect(screen.getByText(mockInvoice.status)).toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: /mark as paid/i })
  ).toBeInTheDocument()

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

  const [headerRow, ...itemRows] = screen.getAllByRole('row')

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
    validateTextIfNonEmpty(
      mockItem.price.toString(),
      within(rowCells[itemPriceIndex])
    )
    validateTextIfNonEmpty(
      mockItem.total.toString(),
      within(rowCells[itemTotalIndex])
    )
  })
})

it.todo('should handle fetch errors')

function validateTextIfNonEmpty(
  text: string,
  withinElement: BoundFunctions<typeof queries> = screen
) {
  if (text) {
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(withinElement.getByText(text)).toBeInTheDocument()
  }
}
