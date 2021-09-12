import * as invoiceModel from 'src/client/test/mocks/invoice.model'

import {
  buildMockInvoiceDetail,
  buildMockInvoiceInput,
  buildMockPendingInvoiceInput,
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
import { format } from 'date-fns'
import { idRegex } from 'src/shared/identifier'
import { invoiceDetailFromInput } from './invoice.mappers'
import { validateGBPValue } from 'src/test/validators'

it('should show list of invoice summaries', async () => {
  const mockInvoiceDetails = [
    buildMockInvoiceDetail(),
    buildMockInvoiceDetail(),
  ]
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
    if (mockInvoice.clientName) {
      expect(inInvoice.getByText(mockInvoice.clientName)).toBeInTheDocument()
    }
    validateGBPValue(mockInvoice.amountDue, inInvoice)
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
it('should validate that fields are filled in when creating pending invoice', async () => {
  render(<InvoiceSummaryScreen />)
  userEvent.click(screen.getByRole('button', { name: /new invoice/i }))

  userEvent.click(screen.getByRole('button', { name: /save & send/i }))

  // wait for validation to complete
  await waitFor(() => {
    expect(
      screen.getByRole('textbox', { name: /client's name/i })
    ).toBeInvalid()
  })

  const elBillFromGroup = screen.getByRole('group', { name: /bill from/i })
  const inBillFrom = within(elBillFromGroup)

  const billFromStreet = inBillFrom.getByRole('textbox', {
    name: /street address/i,
  })
  expect(billFromStreet).toBeInvalid()
  expect(billFromStreet).toHaveAccessibleDescription(/can't be empty/i)
  const billFromCity = inBillFrom.getByRole('textbox', {
    name: /city/i,
  })
  expect(billFromCity).toBeInvalid()
  expect(billFromCity).toHaveAccessibleDescription(/can't be empty/i)
  const billFromPostcode = inBillFrom.getByRole('textbox', {
    name: /post code/i,
  })
  expect(billFromPostcode).toBeInvalid()
  expect(billFromPostcode).toHaveAccessibleDescription(/can't be empty/i)
  const billFromCountry = inBillFrom.getByRole('textbox', {
    name: /country/i,
  })
  expect(billFromCountry).toBeInvalid()
  expect(billFromCountry).toHaveAccessibleDescription(/can't be empty/i)

  const elBillToGroup = screen.getByRole('group', { name: /bill to/i })
  const inBillTo = within(elBillToGroup)

  const clientName = inBillTo.getByRole('textbox', { name: /client's name/i })
  expect(clientName).toBeInvalid()
  expect(clientName).toHaveAccessibleDescription(/can't be empty/i)
  const clientEmail = inBillTo.getByRole('textbox', { name: /client's email/i })
  expect(clientEmail).toBeInvalid()
  expect(clientEmail).toHaveAccessibleDescription(/can't be empty/i)
  const billToStreet = inBillTo.getByRole('textbox', {
    name: /street address/i,
  })
  expect(billToStreet).toBeInvalid()
  expect(billToStreet).toHaveAccessibleDescription(/can't be empty/i)
  const billToCity = inBillTo.getByRole('textbox', {
    name: /city/i,
  })
  expect(billToCity).toBeInvalid()
  expect(billToCity).toHaveAccessibleDescription(/can't be empty/i)
  const billToPostcode = inBillTo.getByRole('textbox', {
    name: /post code/i,
  })
  expect(billToPostcode).toBeInvalid()
  expect(billToPostcode).toHaveAccessibleDescription(/can't be empty/i)
  const billToCountry = inBillTo.getByRole('textbox', {
    name: /country/i,
  })
  expect(billToCountry).toBeInvalid()
  expect(billToCountry).toHaveAccessibleDescription(/can't be empty/i)

  const projectDescription = screen.getByRole('textbox', {
    name: /project description/i,
  })
  expect(projectDescription).toBeInvalid()
  expect(projectDescription).toHaveAccessibleDescription(/can't be empty/i)
})
it.todo('should check for valid email')
it.todo('should check for valid issuedAt date')
it.todo('should check there are invoice items')
it('should allow new draft invoices to be creacted', async () => {
  const existingInvoice = buildMockInvoiceDetail()
  invoiceModel.initialise([existingInvoice])
  const mockDraftInvoiceInput = buildMockInvoiceInput({ status: 'draft' })

  const mockInvoiceSummary = invoiceModel.invoiceDetailToSummary(
    invoiceDetailFromInput(mockDraftInvoiceInput)
  )
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
  // if we haven't given a client name, don't try and find it
  // searching for an empty string will not do anything useful
  if (mockInvoiceSummary.clientName) {
    expect(
      inNewInvoiceItem.getByText(mockInvoiceSummary.clientName)
    ).toBeInTheDocument()
  }
  validateGBPValue(mockInvoiceSummary.amountDue, inNewInvoiceItem)
  expect(
    inNewInvoiceItem.getByText(mockInvoiceSummary.status)
  ).toBeInTheDocument()

  // expect the id to be populated properly once the response from the server received

  const elNotificationArea = screen.getByRole('status')

  const notificationRegex = new RegExp(
    `new invoice id ${idRegex.source} successfully created`,
    'i'
  )

  await waitFor(() =>
    expect(elNotificationArea).toHaveTextContent(notificationRegex)
  )

  const invoiceIdMatch = elNotificationArea.textContent?.match(idRegex)
  if (!invoiceIdMatch)
    throw new Error(
      `Failed to match invoice id of required format in ${elNotificationArea.textContent}`
    )

  const [savedInvoiceId] = invoiceIdMatch
  // we should now have a link to that invoice
  expect(
    inInvoiceTable.getByRole('link', { name: savedInvoiceId })
  ).toHaveAttribute('href', `/invoices/${savedInvoiceId}`)
}, 10000)
it('should allow new pending invoices to be creacted', async () => {
  const existingInvoice = buildMockInvoiceDetail()
  invoiceModel.initialise([existingInvoice])
  const mockPendingInvoiceInput = buildMockPendingInvoiceInput()

  const mockInvoiceSummary = invoiceModel.invoiceDetailToSummary(
    invoiceDetailFromInput(mockPendingInvoiceInput)
  )
  render(<InvoiceSummaryScreen />)

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

  userEvent.click(screen.getByRole('button', { name: /new invoice/i }))

  expect(screen.getByRole('form', { name: /new invoice/i })).toBeInTheDocument()

  const elBillFromGroup = screen.getByRole('group', { name: /bill from/i })
  const inBillFrom = within(elBillFromGroup)

  validateTextfieldEntry(
    inBillFrom.getByLabelText(/street address/i),
    mockPendingInvoiceInput.senderAddress.street
  )
  validateTextfieldEntry(
    inBillFrom.getByLabelText(/city/i),
    mockPendingInvoiceInput.senderAddress.city
  )
  validateTextfieldEntry(
    inBillFrom.getByLabelText(/post code/i),
    mockPendingInvoiceInput.senderAddress.postcode
  )
  validateTextfieldEntry(
    inBillFrom.getByLabelText(/country/i),
    mockPendingInvoiceInput.senderAddress.country
  )

  const elBillToGroup = screen.getByRole('group', { name: /bill to/i })
  const inBillTo = within(elBillToGroup)

  validateTextfieldEntry(
    inBillTo.getByLabelText(/client's name/i),
    mockPendingInvoiceInput.clientName
  )
  validateTextfieldEntry(
    inBillTo.getByLabelText(/client's email/i),
    mockPendingInvoiceInput.clientEmail
  )
  validateTextfieldEntry(
    inBillTo.getByLabelText(/street address/i),
    mockPendingInvoiceInput.senderAddress.street
  )
  validateTextfieldEntry(
    inBillTo.getByLabelText(/city/i),
    mockPendingInvoiceInput.senderAddress.city
  )
  validateTextfieldEntry(
    inBillTo.getByLabelText(/post code/i),
    mockPendingInvoiceInput.senderAddress.postcode
  )
  validateTextfieldEntry(
    inBillTo.getByLabelText(/country/i),
    mockPendingInvoiceInput.senderAddress.country
  )

  validateTextfieldEntry(
    screen.getByLabelText(/issue date/i),
    format(mockPendingInvoiceInput.issuedAt, 'yyyy-MM-dd')
  )
  validateTextfieldEntry(
    screen.getByLabelText(/payment terms/i),
    mockPendingInvoiceInput.paymentTerms.toString(),
    mockPendingInvoiceInput.paymentTerms
  )
  validateTextfieldEntry(
    screen.getByLabelText(/project description/i),
    mockPendingInvoiceInput.projectDescription
  )

  const elItemList = screen.getByRole('table', { name: /item list/i })
  const inItemList = within(elItemList)

  mockPendingInvoiceInput.itemList.forEach((item) => {
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

  // save the pending invoice

  userEvent.click(screen.getByRole('button', { name: /save & send/i }))

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
  validateGBPValue(mockInvoiceSummary.amountDue, inNewInvoiceItem)
  expect(
    inNewInvoiceItem.getByText(mockInvoiceSummary.status)
  ).toBeInTheDocument()

  // expect the id to be populated properly once the response from the server received

  const elNotificationArea = screen.getByRole('status')
  const notificationRegex = new RegExp(
    `new invoice id ${idRegex.source} successfully created`,
    'i'
  )

  await waitFor(() =>
    expect(elNotificationArea).toHaveTextContent(notificationRegex)
  )

  const invoiceIdMatch = elNotificationArea.textContent?.match(idRegex)
  if (!invoiceIdMatch)
    throw new Error(
      `Failed to match invoice id of required format in ${elNotificationArea.textContent}`
    )

  const [savedInvoiceId] = invoiceIdMatch
  // we should now have a link to that invoice
  expect(
    inInvoiceTable.getByRole('link', { name: savedInvoiceId })
  ).toHaveAttribute('href', `/invoices/${savedInvoiceId}`)
}, 10000)
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
  entryValue: string | undefined,
  expectedValue: string | number | undefined = entryValue
) {
  if (!entryValue) return
  userEvent.type(field, entryValue)
  expect(field).toHaveValue(expectedValue)
}
