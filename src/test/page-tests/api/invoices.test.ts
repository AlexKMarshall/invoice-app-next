import { buildMockDraftInvoiceInput } from 'src/server/test/mocks/invoice.fixtures'
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

it('should post a draft invoice', async () => {
  expect.hasAssertions()

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
