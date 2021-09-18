import { database, prepareDbForTests } from 'src/server/test/test-utils'

import { buildMockInvoiceDetail } from 'src/server/test/mocks/invoice.fixtures'
import handler from 'src/pages/api/invoices/[id]/status'
import { testApiHandler } from 'next-test-api-route-handler'

prepareDbForTests()

it('should mark pending invoice as paid', async () => {
  expect.hasAssertions()

  const pendingInvoice = buildMockInvoiceDetail({ status: 'pending' })

  await database.seedInvoices(pendingInvoice)

  await testApiHandler({
    handler,
    params: { id: pendingInvoice.id },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'PUT',
        body: JSON.stringify({
          status: 'paid',
        }),
        headers: {
          'content-type': 'application/json',
        },
      })

      expect(response.status).toBe(200)
      const result = await response.json()

      expect(result).toMatchObject({
        data: {
          updatedInvoice: {
            id: pendingInvoice.id,
            status: 'paid',
          },
        },
      })
    },
  })
})
it.todo('should not allow draft invoice to be paid')
