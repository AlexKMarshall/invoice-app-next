import * as invoiceModel from 'src/client/test/mocks/invoice.model'

import { screen, waitForElementToBeRemoved } from '@testing-library/react'

import { buildMockInvoiceDetail } from 'src/client/test/mocks/invoice.fixtures'
import { getPage } from 'next-page-tester'
import { userEvent } from 'src/client/test/test-utils'

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
}, 10000)
