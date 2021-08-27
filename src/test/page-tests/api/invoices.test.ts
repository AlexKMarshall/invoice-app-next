import {
  buildMockDraftInvoiceInput,
  buildMockInvoiceSummary,
} from 'src/server/test/mocks/invoice.fixtures'
import { connect, disconnect, seedInvoices } from 'src/server/database'

import handler from 'src/pages/api/invoices'
import { testApiHandler } from 'next-test-api-route-handler'

beforeAll(async () => {
  await connect()
})

afterAll(async () => {
  await disconnect()
})

it('should get invoices', async () => {
  expect.hasAssertions()

  const mockInvoices = [buildMockInvoiceSummary(), buildMockInvoiceSummary()]

  await seedInvoices(...mockInvoices)

  await testApiHandler({
    handler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: 'GET' })
      const data = await response.json()

      expect(data).toEqual({
        data: {
          invoices: JSON.parse(JSON.stringify(mockInvoices)),
        },
      })
    },
  })
})

it('should post a draft invoice', async () => {
  expect.hasAssertions()

  const mockInvoices = [buildMockInvoiceSummary(), buildMockInvoiceSummary()]

  await seedInvoices(...mockInvoices)

  await testApiHandler({
    handler,
    test: async ({ fetch }) => {
      const data = buildMockDraftInvoiceInput()

      const response = await fetch({
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
      })

      const result = await response.json()

      expect(result).toMatchObject({
        data: {
          savedInvoice: {
            ...JSON.parse(JSON.stringify(data)),
            id: expect.stringMatching(/[A-Z]{2}\d{4}/),
          },
        },
      })
    },
  })
})
