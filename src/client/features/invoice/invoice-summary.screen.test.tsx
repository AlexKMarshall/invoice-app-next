import * as invoiceModel from 'src/client/test/mocks/invoice.model'

import { currencyFormatter, generateInvoiceId } from 'src/client/shared/utils'
import {
  render,
  screen,
  userEvent,
  waitForElementToBeRemoved,
  within,
} from 'src/client/test/test-utils'

import { InvoiceSummaryScreen } from './invoice-summary.screen'
import faker from 'faker'
import { format } from 'date-fns'

function randomStatus() {
  const statuses = ['draft', 'pending', 'paid'] as const
  const randomIndex = Math.floor(Math.random() * statuses.length)
  return statuses[randomIndex]
}

function buildMockInvoiceSummary() {
  return {
    id: generateInvoiceId(),
    paymentDue: faker.date.soon(),
    clientName: faker.name.findName(),
    total: faker.datatype.number(),
    status: randomStatus(),
  }
}

function buildMockDraftInvoiceInput() {
  return {
    senderAddress: {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      postcode: faker.address.zipCode(),
      country: faker.address.country(),
    },
    clientAddress: {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      postcode: faker.address.zipCode(),
      country: faker.address.country(),
    },
    issuedAt: faker.date.recent(),
    paymentTerms: faker.datatype.number(),
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

it('should show list of invoice summaries', async () => {
  const mockInvoices = [buildMockInvoiceSummary(), buildMockInvoiceSummary()]
  invoiceModel.initialise(mockInvoices)
  render(<InvoiceSummaryScreen />)

  expect(screen.getByRole('heading', { name: /invoices/i })).toBeInTheDocument()
  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

  expect(screen.getByRole('list')).toBeInTheDocument()

  mockInvoices.forEach((mockInvoice) => {
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
it('should allow new draft invoices to be creacted', () => {
  const mockDraftInvoiceInput = buildMockDraftInvoiceInput()
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
    mockDraftInvoiceInput.paymentTerms.toString()
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
    (mockDraftInvoiceInput.itemList[0].price / 100).toString(),
    mockDraftInvoiceInput.itemList[0].price / 100
  )

  const elItemTotal = inItemList.getByLabelText(/total/i)
  expect(elItemTotal).toHaveValue(
    (mockDraftInvoiceInput.itemList[0].price *
      mockDraftInvoiceInput.itemList[0].quantity) /
      100
  )

  userEvent.click(screen.getByRole('button', { name: /save as draft/i }))
})

function validateTextfieldEntry(
  field: HTMLElement,
  entryValue: string,
  expectedValue: string | number = entryValue
) {
  userEvent.type(field, entryValue)
  expect(field).toHaveValue(expectedValue)
}
