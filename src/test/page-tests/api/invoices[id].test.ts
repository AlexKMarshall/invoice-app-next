import { database, prepareDbForTests } from 'src/server/test/test-utils'

import { buildMockInvoiceDetail } from 'src/server/test/mocks/invoice.fixtures'
import handler from 'src/pages/api/invoices/[id]'
import { testApiHandler } from 'next-test-api-route-handler'

prepareDbForTests()

it('should get individual invoice detail', async () => {
  expect.hasAssertions()

  const mockInvoice = buildMockInvoiceDetail()
  const mockInvoices = [mockInvoice, buildMockInvoiceDetail()]

  await database.seedInvoices(...mockInvoices)

  await testApiHandler({
    handler,
    params: { id: mockInvoice.id },
    test: async ({ fetch }) => {
      const response = await fetch({ method: 'GET' })

      expect(response.status).toBe(200)

      const data = await response.json()

      expect(data).toEqual({
        data: {
          invoice: {
            ...JSON.parse(JSON.stringify(mockInvoice)),
            // we don't care about the order of the itemList array
            itemList: expect.toIncludeSameMembers(mockInvoice.itemList),
          },
        },
      })
    },
  })
})
it('should return 404 if no invoice for given id', async () => {
  expect.hasAssertions()

  await database.seedInvoices(buildMockInvoiceDetail())

  await testApiHandler({
    handler,
    params: { id: 'bad-id' },
    test: async ({ fetch }) => {
      const response = await fetch({ method: 'GET' })

      expect(response.status).toBe(404)

      const data = await response.json()

      expect(data).toEqual({
        error: expect.stringMatching(/cannot find invoice with id 'bad-id'/i),
      })
    },
  })
})
