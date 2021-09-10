import { database, prepareDbForTests } from 'src/server/test/test-utils'

import { addPaymentDue } from 'src/server/features/invoice/invoice.mappers'
import { buildMockInvoiceInput } from 'src/server/test/mocks/invoice.fixtures'
import { generateId } from 'src/shared/identifier'
import handler from 'src/pages/api/invoices/[id]'
import { testApiHandler } from 'next-test-api-route-handler'

prepareDbForTests()

it('should get individual invoice detail', async () => {
  expect.hasAssertions()

  const mockInvoiceInput = { id: generateId(), ...buildMockInvoiceInput() }
  const mockInvoiceDetail = addPaymentDue(mockInvoiceInput)
  const mockInvoices = [mockInvoiceInput, buildMockInvoiceInput()]

  await database.seedInvoices(...mockInvoices)

  await testApiHandler({
    handler,
    params: { id: mockInvoiceDetail.id },
    test: async ({ fetch }) => {
      const response = await fetch({ method: 'GET' })

      expect(response.status).toBe(200)

      const data = await response.json()

      expect(data).toEqual({
        data: {
          invoice: {
            ...JSON.parse(JSON.stringify(mockInvoiceDetail)),
            // we don't care about the order of the itemList array
            itemList: expect.toIncludeSameMembers(mockInvoiceDetail.itemList),
          },
        },
      })
    },
  })
})
it('should return 404 if no invoice for given id', async () => {
  expect.hasAssertions()

  await database.seedInvoices(buildMockInvoiceInput())

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
