import * as invoiceModel from 'src/client/test/mocks/invoice.model'

import {
  buildMockDraftInvoiceInput,
  buildMockInvoice,
} from 'src/client/test/mocks/invoice.fixtures'
import {
  render,
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from 'src/client/test/test-utils'

import { InvoiceSummaryScreen } from './invoice-summary.screen'
import { currencyFormatter } from 'src/client/shared/utils'
import { format } from 'date-fns'

it('should show list of invoice summaries', async () => {
  const mockInvoiceDetails = [buildMockInvoice(), buildMockInvoice()]
  invoiceModel.initialise(mockInvoiceDetails)
  const mockInvoiceSummaries = mockInvoiceDetails.map(
    invoiceModel.invoiceDetailToSummary
  )
  render(<InvoiceSummaryScreen />)

  expect(screen.getByRole('heading', { name: /invoices/i })).toBeInTheDocument()
  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

  const invoiceCount = mockInvoiceSummaries.length
  expect(screen.getByText(`There are ${invoiceCount} total invoices`))

  expect(screen.getByRole('table', { name: /invoices/i })).toBeInTheDocument()

  mockInvoiceSummaries.forEach((mockInvoice) => {
    const elInvoice = screen.getByRole('row', { name: mockInvoice.id })
    const inInvoice = within(elInvoice)

    const invoiceLink = inInvoice.getByRole('link')
    expect(invoiceLink).toHaveAttribute('href', `/invoices/${mockInvoice.id}`)
    expect(invoiceLink).toHaveAccessibleName(mockInvoice.id)
    expect(
      inInvoice.getByText(
        `Due ${format(mockInvoice.paymentDue, 'dd MMM yyyy')}`
      )
    ).toBeInTheDocument()
    expect(inInvoice.getByText(mockInvoice.clientName)).toBeInTheDocument()
    expect(
      inInvoice.getByText(currencyFormatter.format(mockInvoice.total / 100))
    ).toBeInTheDocument()
    expect(inInvoice.getByText(mockInvoice.status)).toBeInTheDocument()
  })
})

it('should show empty state when there are no invoices', async () => {
  invoiceModel.initialise([])

  render(<InvoiceSummaryScreen />)

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))
  expect(screen.getByText(/no invoices/i)).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: /there is nothing here/i })
  ).toBeInTheDocument()
})
it('should not show new invoice form until button is clicked', () => {
  render(<InvoiceSummaryScreen />)

  expect(
    screen.queryByRole('form', { name: /new invoice/i })
  ).not.toBeInTheDocument()
})
it('should allow new draft invoices to be creacted', async () => {
  const existingInvoice = buildMockInvoice()
  invoiceModel.initialise([existingInvoice])
  const mockDraftInvoiceInput = buildMockDraftInvoiceInput()
  // we aren't validating the id here, so we can give it an empty string
  const mockInvoiceSummary = invoiceModel.invoiceDetailToSummary({
    id: '',
    ...mockDraftInvoiceInput,
  })
  render(<InvoiceSummaryScreen />)

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

  userEvent.click(screen.getByRole('button', { name: /new invoice/i }))

  expect(screen.getByRole('form', { name: /new invoice/i })).toBeInTheDocument()

  const elBillFromGroup = screen.getByRole('group', { name: /bill from/i })
  const inBillFrom = within(elBillFromGroup)

  validateTextfieldEntry(
    inBillFrom.getByLabelText(/street address/i),
    mockDraftInvoiceInput.senderAddress.street
  )
  validateTextfieldEntry(
    inBillFrom.getByLabelText(/city/i),
    mockDraftInvoiceInput.senderAddress.city
  )
  validateTextfieldEntry(
    inBillFrom.getByLabelText(/post code/i),
    mockDraftInvoiceInput.senderAddress.postcode
  )
  validateTextfieldEntry(
    inBillFrom.getByLabelText(/country/i),
    mockDraftInvoiceInput.senderAddress.country
  )

  const elBillToGroup = screen.getByRole('group', { name: /bill to/i })
  const inBillTo = within(elBillToGroup)

  validateTextfieldEntry(
    inBillTo.getByLabelText(/client's name/i),
    mockDraftInvoiceInput.clientName
  )
  validateTextfieldEntry(
    inBillTo.getByLabelText(/client's email/i),
    mockDraftInvoiceInput.clientEmail
  )
  validateTextfieldEntry(
    inBillTo.getByLabelText(/street address/i),
    mockDraftInvoiceInput.senderAddress.street
  )
  validateTextfieldEntry(
    inBillTo.getByLabelText(/city/i),
    mockDraftInvoiceInput.senderAddress.city
  )
  validateTextfieldEntry(
    inBillTo.getByLabelText(/post code/i),
    mockDraftInvoiceInput.senderAddress.postcode
  )
  validateTextfieldEntry(
    inBillTo.getByLabelText(/country/i),
    mockDraftInvoiceInput.senderAddress.country
  )

  validateTextfieldEntry(
    screen.getByLabelText(/issue date/i),
    format(mockDraftInvoiceInput.issuedAt, 'yyyy-MM-dd')
  )
  validateTextfieldEntry(
    screen.getByLabelText(/payment terms/i),
    mockDraftInvoiceInput.paymentTerms.toString(),
    mockDraftInvoiceInput.paymentTerms
  )
  validateTextfieldEntry(
    screen.getByLabelText(/project description/i),
    mockDraftInvoiceInput.projectDescription
  )

  const elItemList = screen.getByRole('table', { name: /item list/i })
  const inItemList = within(elItemList)

  mockDraftInvoiceInput.itemList.forEach((item) => {
    userEvent.click(screen.getByRole('button', { name: /add new item/i }))

    const [lastRow] = inItemList.getAllByRole('row').slice(-1)
    const inLastRow = within(lastRow)

    validateTextfieldEntry(inLastRow.getByLabelText(/item name/i), item.name)
    validateTextfieldEntry(
      inLastRow.getByLabelText(/quantity/i),
      item.quantity.toString(),
      item.quantity
    )
    validateTextfieldEntry(
      inLastRow.getByLabelText(/price/i),
      item.price.toString(),
      item.price
    )
  })

  // save the draft invoice

  userEvent.click(screen.getByRole('button', { name: /save as draft/i }))

  // Expect the new invoice to appear optimistically

  const elInvoiceTable = await screen.findByRole('table', { name: /invoices/i })
  const inInvoiceTable = within(elInvoiceTable)
  const savingIdDisplay = '------'
  const elNewInvoiceItem = inInvoiceTable.getByRole('row', {
    name: savingIdDisplay,
  })
  const inNewInvoiceItem = within(elNewInvoiceItem)

  // invoices don't get links til they're saved and have a real ID
  expect(inNewInvoiceItem.queryByRole('link')).not.toBeInTheDocument()

  expect(
    inNewInvoiceItem.getByText(
      `Due ${format(mockInvoiceSummary.paymentDue, 'dd MMM yyyy')}`
    )
  ).toBeInTheDocument()
  expect(
    inNewInvoiceItem.getByText(mockInvoiceSummary.clientName)
  ).toBeInTheDocument()
  expect(
    inNewInvoiceItem.getByText(
      currencyFormatter.format(mockInvoiceSummary.total / 100)
    )
  ).toBeInTheDocument()
  expect(
    inNewInvoiceItem.getByText(mockInvoiceSummary.status)
  ).toBeInTheDocument()

  // expect the id to be populated properly once the response from the server received

  const elNotificationArea = screen.getByRole('status')

  await waitFor(() =>
    expect(elNotificationArea).toHaveTextContent(
      /New invoice id .* successfully created/i
    )
  )

  const invoiceIdMatch = elNotificationArea.textContent?.match(/[A-Z]{2}\d{4}/)
  if (!invoiceIdMatch)
    throw new Error(
      `Failed to match invoice id of required format in ${elNotificationArea.textContent}`
    )

  const [savedInvoiceId] = invoiceIdMatch
  // we should now have a link to that invoice
  expect(
    inInvoiceTable.getByRole('link', { name: savedInvoiceId })
  ).toHaveAttribute('href', `/invoices/${savedInvoiceId}`)
})
it('should default invoice issue date to today', () => {
  const today = new Date()
  render(<InvoiceSummaryScreen />)

  userEvent.click(screen.getByRole('button', { name: /new invoice/i }))

  expect(screen.getByLabelText(/issue date/i)).toHaveValue(
    format(today, 'yyyy-MM-dd')
  )
})
it('should be possible to cancel the new invoice form', () => {
  render(<InvoiceSummaryScreen />)

  expect(screen.getByRole('heading', { name: /invoices/i })).toBeInTheDocument()

  userEvent.click(screen.getByRole('button', { name: /new invoice/i }))
  expect(
    screen.queryByRole('heading', { name: /invoices/i })
  ).not.toBeInTheDocument()
  expect(screen.getByRole('form', { name: /new invoice/i })).toBeInTheDocument()

  userEvent.click(screen.getByRole('button', { name: /discard/i }))

  expect(
    screen.queryByRole('form', { name: /new invoice/i })
  ).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /invoices/i })).toBeInTheDocument()
})

function validateTextfieldEntry(
  field: HTMLElement,
  entryValue: string,
  expectedValue: string | number = entryValue
) {
  userEvent.type(field, entryValue)
  expect(field).toHaveValue(expectedValue)
}
