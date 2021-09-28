import handler from 'src/pages/api/payment-terms'
import { prepareDbForTests } from 'src/server/test/test-utils'
import { testApiHandler } from 'next-test-api-route-handler'

const referenceDataStore = prepareDbForTests()

it('should get payment terms', async () => {
  expect.hasAssertions()

  const expectedPaymentTerms = referenceDataStore.paymentTerms

  await testApiHandler({
    handler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: 'GET' })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toEqual({
        data: {
          paymentTerms: expect.toIncludeSameMembers(
            expectedPaymentTerms.map((paymentTerm) => ({
              ...paymentTerm,
              id: expect.any(Number),
            }))
          ),
        },
      })
    },
  })
})
