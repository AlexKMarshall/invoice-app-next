import * as invoiceModel from 'src/client/test/mocks/invoice.model'

import {
  buildMockInvoiceDetail,
  buildMockInvoiceInput,
  buildMockPendingInvoiceInput,
} from 'src/client/test/mocks/invoice.fixtures'
import {
  fillInInvoiceForm,
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from 'src/client/test/test-utils'

import { format } from 'date-fns'
import { getPage } from 'next-page-tester'
import { idRegex } from 'src/shared/identifier'
import { invoiceDetailFromInput } from 'src/client/features/invoice/invoice.mappers'
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

  const { render } = await getPage({
    route: '/',
  })

  render()

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
it('should show a list of invoice summaries filtered by status', async () => {
  const draftInvoice = buildMockInvoiceDetail({ status: 'draft' })
  const pendingInvoice = buildMockInvoiceDetail({ status: 'pending' })
  const paidInvoice = buildMockInvoiceDetail({ status: 'paid' })

  invoiceModel.initialise([draftInvoice, pendingInvoice, paidInvoice])

  const { render } = await getPage({
    route: '/',
  })

  render()

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))
  expect(screen.getByText(draftInvoice.id)).toBeInTheDocument()
  expect(screen.getByText(pendingInvoice.id)).toBeInTheDocument()
  expect(screen.getByText(paidInvoice.id)).toBeInTheDocument()

  const filterSelect = screen.getByRole('listbox', {
    name: /filter by status/i,
  })
  const draftOption = screen.getByRole('option', { name: /draft/i })
  // select only draft invoices
  userEvent.selectOptions(filterSelect, draftOption)

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

  expect(screen.getByText(draftInvoice.id)).toBeInTheDocument()
  expect(screen.queryByText(pendingInvoice.id)).not.toBeInTheDocument()
  expect(screen.queryByText(paidInvoice.id)).not.toBeInTheDocument()

  // select additionally pending invoices (it's a multi-select)
  const pendingOption = screen.getByRole('option', { name: /pending/i })
  userEvent.selectOptions(filterSelect, pendingOption)

  await screen.findByText(pendingInvoice.id)
  expect(screen.getByText(draftInvoice.id)).toBeInTheDocument()
  expect(screen.getByText(pendingInvoice.id)).toBeInTheDocument()
  expect(screen.queryByText(paidInvoice.id)).not.toBeInTheDocument()

  // deselect both so filter is empty
  userEvent.deselectOptions(filterSelect, [draftOption, pendingOption])

  await screen.findByText(paidInvoice.id)
  expect(screen.getByText(draftInvoice.id)).toBeInTheDocument()
  expect(screen.getByText(pendingInvoice.id)).toBeInTheDocument()
  expect(screen.getByText(paidInvoice.id)).toBeInTheDocument()
})

it('should show empty state when there are no invoices', async () => {
  invoiceModel.initialise([])

  const { render } = await getPage({
    route: '/',
  })

  render()

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))
  expect(screen.getByText(/no invoices/i)).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: /there is nothing here/i })
  ).toBeInTheDocument()
})
it('should not show new invoice form until button is clicked', async () => {
  const { render } = await getPage({
    route: '/',
  })

  render()

  expect(
    screen.queryByRole('form', { name: /new invoice/i })
  ).not.toBeInTheDocument()
})
it('should validate that fields are filled in when creating pending invoice', async () => {
  const { render } = await getPage({
    route: '/',
  })

  render()

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

  const { render } = await getPage({
    route: '/',
  })

  render()

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

  userEvent.click(screen.getByRole('button', { name: /new invoice/i }))

  expect(screen.getByRole('form', { name: /new invoice/i })).toBeInTheDocument()

  fillInInvoiceForm(mockDraftInvoiceInput)

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
  const { render } = await getPage({
    route: '/',
  })

  render()

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

  userEvent.click(screen.getByRole('button', { name: /new invoice/i }))

  expect(screen.getByRole('form', { name: /new invoice/i })).toBeInTheDocument()

  fillInInvoiceForm(mockPendingInvoiceInput)

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
it('should be possible to cancel the new invoice form', async () => {
  const { render } = await getPage({
    route: '/',
  })

  render()

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
it('should go to invoice detail page when clicking on invoice link', async () => {
  const invoice = buildMockInvoiceDetail()
  invoiceModel.initialise([invoice])

  const { render } = await getPage({
    route: '/',
  })

  render()

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))
  userEvent.click(screen.getByRole('row'))

  await waitForElementToBeRemoved(() =>
    screen.getByRole('heading', { name: /invoices/i })
  )

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

  expect(screen.getByRole('heading', { name: invoice.id }))
})
