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
  expect(screen.getByText(mockInvoice.projectDescription)).toBeInTheDocument()
  expect(screen.getByText(mockInvoice.senderAddress.street)).toBeInTheDocument()
  expect(screen.getByText(mockInvoice.senderAddress.city)).toBeInTheDocument()
  expect(
    screen.getByText(mockInvoice.senderAddress.postcode)
  ).toBeInTheDocument()
  expect(
    screen.getByText(mockInvoice.senderAddress.country)
  ).toBeInTheDocument()
  expect(
    screen.getByText(format(mockInvoice.issuedAt, 'dd MMM yyyy'))
  ).toBeInTheDocument()
  expect(
    screen.getByText(format(mockInvoice.paymentDue, 'dd MMM yyyy'))
  ).toBeInTheDocument()
  expect(screen.getByText(mockInvoice.clientName)).toBeInTheDocument()
  expect(screen.getByText(mockInvoice.clientAddress.street)).toBeInTheDocument()
  expect(screen.getByText(mockInvoice.clientAddress.city)).toBeInTheDocument()
  expect(
    screen.getByText(mockInvoice.clientAddress.postcode)
  ).toBeInTheDocument()
  expect(
    screen.getByText(mockInvoice.clientAddress.country)
  ).toBeInTheDocument()
  expect(screen.getByText(mockInvoice.clientEmail)).toBeInTheDocument()
})

it.todo('should handle fetch errors')
