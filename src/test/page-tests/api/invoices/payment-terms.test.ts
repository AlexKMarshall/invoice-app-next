import { database, prepareDbForTests } from 'src/server/test/test-utils'

import handler from 'src/pages/api/payment-terms'
import { invoiceDetailToSummary } from 'src/server/features/invoice/invoice.mappers'
import { testApiHandler } from 'next-test-api-route-handler'

prepareDbForTests()

it('should get payment terms', async () => {
  expect.hasAssertions()

  const paymentTerms = [
    { name: 'Net 1 Day', value: 1 },
    { name: 'Net 7 Days', value: 7 },
  ]

  await database.seedPaymentTerms(...paymentTerms)

  await testApiHandler({
    handler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: 'GET' })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toEqual({
        data: {
          paymentTerms: expect.toIncludeSameMembers(
            paymentTerms.map((paymentTerm) => ({
              ...paymentTerm,
              id: expect.any(Number),
            }))
          ),
        },
      })
    },
  })
})
