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
