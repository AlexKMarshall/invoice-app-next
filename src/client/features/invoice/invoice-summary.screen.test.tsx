import * as invoiceModel from 'src/client/test/mocks/invoice.model'

import { QueryClient, QueryClientProvider } from 'react-query'
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react'

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
    id: faker.datatype.uuid(),
    paymentDue: faker.date.soon(),
    clientName: faker.name.findName(),
    total: faker.datatype.number(),
    status: randomStatus(),
  }
}

it('should show list of invoice summaries', async () => {
  const mockInvoices = [buildMockInvoiceSummary(), buildMockInvoiceSummary()]
  invoiceModel.initialise(mockInvoices)
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <InvoiceSummaryScreen />
    </QueryClientProvider>
  )

  expect(screen.getByRole('heading', { name: /invoices/i })).toBeInTheDocument()
  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

  expect(screen.getByRole('list')).toBeInTheDocument()

  mockInvoices.forEach((mockInvoice) => {
    const elInvoice = screen.getByRole('listitem', { name: mockInvoice.id })
    expect(
      within(elInvoice).getByText(
        `Due ${format(mockInvoice.paymentDue, 'dd MMM yyyy')}`
      )
    ).toBeInTheDocument()
    expect(
      within(elInvoice).getByText(mockInvoice.clientName)
    ).toBeInTheDocument()
    expect(within(elInvoice).getByText(mockInvoice.total)).toBeInTheDocument()
    expect(within(elInvoice).getByText(mockInvoice.status)).toBeInTheDocument()
  })
})
