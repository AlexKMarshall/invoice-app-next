import * as invoiceModel from 'src/client/test/mocks/invoice.model'

import { currencyFormatter, generateInvoiceId } from 'src/client/shared/utils'
import {
  render,
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from 'src/client/test/test-utils'

import { InvoiceSummaryScreen } from './invoice-summary.screen'
import faker from 'faker'
import { format } from 'date-fns'

function buildMockDraftInvoiceInput() {
  return {
    senderAddress: {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      postcode: faker.address.zipCode(),
      country: faker.address.country(),
    },
    clientName: faker.name.findName(),
    clientEmail: faker.internet.email(),
    clientAddress: {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      postcode: faker.address.zipCode(),
      country: faker.address.country(),
    },
    issuedAt: faker.date.recent(),
    paymentTerms: faker.datatype.number({ max: 30 }),
    projectDescription: faker.commerce.productDescription(),
    itemList: [
      {
        name: faker.commerce.product(),
        quantity: faker.datatype.number(),
        price: faker.datatype.number(),
      },
    ],
  }
}

function buildMockDraftInvoice() {
  return {
    id: generateInvoiceId(),
    status: 'draft' as const,
    ...buildMockDraftInvoiceInput(),
  }
}

it('should show list of invoice summaries', async () => {
  const mockInvoiceDetails = [buildMockDraftInvoice(), buildMockDraftInvoice()]
  invoiceModel.initialise(mockInvoiceDetails)
  const mockInvoiceSummaries = mockInvoiceDetails.map(
    invoiceModel.invoiceDetailToSummary
  )
  render(<InvoiceSummaryScreen />)

  expect(screen.getByRole('heading', { name: /invoices/i })).toBeInTheDocument()
  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

  expect(screen.getByRole('list')).toBeInTheDocument()

  mockInvoiceSummaries.forEach((mockInvoice) => {
    // eslint-disable-next-line testing-library/no-node-access
    const elInvoice = screen.getByText(mockInvoice.id).closest('li')
    if (!elInvoice)
      throw new Error(`No <li> element found closest to ${mockInvoice.id}`)

    const inInvoice = within(elInvoice)
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
  expect(
    screen.getByRole('heading', { name: /there is nothing here/i })
  ).toBeInTheDocument()
})
it('should allow new draft invoices to be creacted', async () => {
  const mockDraftInvoiceInput = buildMockDraftInvoiceInput()
  // we aren't validating the id here, so we can give it an empty string
  const mockInvoiceSummary = invoiceModel.invoiceDetailToSummary({
    id: '',
    status: 'draft',
    ...mockDraftInvoiceInput,
  })
  render(<InvoiceSummaryScreen />)

  expect(screen.getByRole('form', { name: /new invoice/i })).toBeInTheDocument()

  const elBillFromSection = screen.getByRole('region', { name: /bill from/i })
  const inBillFrom = within(elBillFromSection)

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

  const elBillToSection = screen.getByRole('region', { name: /bill to/i })
  const inBillTo = within(elBillToSection)

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

  const elItemListSection = screen.getByRole('region', { name: /item list/i })
  const inItemList = within(elItemListSection)

  validateTextfieldEntry(
    inItemList.getByLabelText(/item name/i),
    mockDraftInvoiceInput.itemList[0].name
  )
  validateTextfieldEntry(
    inItemList.getByLabelText(/qty/i),
    mockDraftInvoiceInput.itemList[0].quantity.toString(),
    mockDraftInvoiceInput.itemList[0].quantity
  )
  validateTextfieldEntry(
    inItemList.getByLabelText(/price/i),
    mockDraftInvoiceInput.itemList[0].price.toString(),
    mockDraftInvoiceInput.itemList[0].price
  )

  const elItemTotal = inItemList.getByLabelText(/total/i)
  expect(elItemTotal).toHaveTextContent(
    (
      mockDraftInvoiceInput.itemList[0].price *
      mockDraftInvoiceInput.itemList[0].quantity
    ).toString()
  )

  // save the draft invoice

  userEvent.click(screen.getByRole('button', { name: /save as draft/i }))

  // Expect the new invoice to appear optimistically

  const elInvoiceList = await screen.findByRole('list')
  const inInvoiceList = within(elInvoiceList)
  const savingIdDisplay = '------'
  const elNewInvoiceId = inInvoiceList.getByText(savingIdDisplay)
  const elNewInvoiceItem = elNewInvoiceId.closest('li')
  if (!elNewInvoiceItem)
    throw new Error('New invoice is not a descendent of a list item')
  const inNewInvoiceItem = within(elNewInvoiceItem)

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
  expect(
    inInvoiceList.getByRole('link', { name: savedInvoiceId })
  ).toBeInTheDocument()
})
it('should default invoice issue date to today', () => {
  const today = new Date()
  render(<InvoiceSummaryScreen />)
  expect(screen.getByLabelText(/issue date/i)).toHaveValue(
    format(today, 'yyyy-MM-dd')
  )
})

function validateTextfieldEntry(
  field: HTMLElement,
  entryValue: string,
  expectedValue: string | number = entryValue
) {
  userEvent.type(field, entryValue)
  expect(field).toHaveValue(expectedValue)
}
