import * as invoiceModel from 'src/client/test/mocks/invoice.model'

import { screen, waitForElementToBeRemoved } from '@testing-library/react'

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
})

it.todo('should handle fetch errors')

function validateTextIfNonEmpty(text: string) {
  if (text) {
    expect(screen.getByText(text)).toBeInTheDocument()
  }
}
