import { database, prepareDbForTests } from 'src/server/test/test-utils'

import { buildMockInvoiceDetail } from 'src/server/test/mocks/invoice.fixtures'
import { generateAlphanumericId } from 'src/shared/identifier'
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
it('should reject if invoice does not exist', async () => {
  expect.hasAssertions()

  const missingInvoiceId = generateAlphanumericId()

  await testApiHandler({
    handler,
    params: { id: missingInvoiceId },
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

      expect(response.status).toBe(404)
      const result = await response.json()

      expect(result).toEqual({
        error: expect.stringMatching(/cannot find invoice with id/i),
      })
    },
  })
})
it.only('should reject if invoice is draft', async () => {
  expect.hasAssertions()

  const draftInvoice = buildMockInvoiceDetail({ status: 'draft' })
  await database.seedInvoices(draftInvoice)

  await testApiHandler({
    handler,
    params: { id: draftInvoice.id },
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

      expect(response.status).toBe(403)
      const result = await response.json()

      expect(result).toEqual({
        error: expect.stringMatching(/cannot mark draft invoice .* as paid/i),
      })
    },
  })
})
