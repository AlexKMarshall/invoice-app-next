import handler from 'src/pages/api/invoices'
import { testApiHandler } from 'next-test-api-route-handler'

it('should get invoices', async () => {
  expect.hasAssertions()

  await testApiHandler({
    handler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: 'GET' })
      const data = await response.json()

      expect(data).toMatchObject({
        data: {
          invoices: expect.any(Array),
        },
      })
    },
  })
})
