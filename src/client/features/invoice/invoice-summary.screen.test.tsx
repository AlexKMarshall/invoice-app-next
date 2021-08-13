import * as invoiceModel from 'src/client/test/mocks/invoice.model'

import { QueryClient, QueryClientProvider } from 'react-query'
import { currencyFormatter, generateInvoiceId } from 'src/client/shared/utils'
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
    id: generateInvoiceId(),
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
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  render(
    <QueryClientProvider client={queryClient}>
      <InvoiceSummaryScreen />
    </QueryClientProvider>
  )

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))
  expect(
    screen.getByRole('heading', { name: /there is nothing here/i })
  ).toBeInTheDocument()
})
