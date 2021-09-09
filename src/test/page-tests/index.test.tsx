import * as invoiceModel from 'src/client/test/mocks/invoice.model'

import { screen, waitForElementToBeRemoved } from '@testing-library/react'

import { buildMockInvoiceDetail } from 'src/client/test/mocks/invoice.fixtures'
import { getPage } from 'next-page-tester'
import { userEvent } from 'src/client/test/test-utils'

it('should go to invoice detail page when clicking on invoice link', async () => {
  invoiceModel.initialise([buildMockInvoiceDetail()])

  const { render } = await getPage({
    route: '/',
  })

  render()

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
  userEvent.click(screen.getByRole('row'))

  expect(await screen.findByText(/mark as paid/i)).toBeInTheDocument()
})
