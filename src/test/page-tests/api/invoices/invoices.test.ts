import {
  buildMockInvoiceDetail,
  buildMockPendingInvoiceInput,
} from 'src/server/test/mocks/invoice.fixtures'
import { database, prepareDbForTests } from 'src/server/test/test-utils'
import {
  invoiceDetailFromInput,
  invoiceDetailToSummary,
} from 'src/server/features/invoice/invoice.mappers'

import handler from 'src/pages/api/invoices'
import { idRegex } from 'src/shared/identifier'
import { testApiHandler } from 'next-test-api-route-handler'

prepareDbForTests()

it('should get invoice summaries', async () => {
  expect.hasAssertions()

  const mockInvoices = [buildMockInvoiceDetail(), buildMockInvoiceDetail()]

  await database.seedInvoices(...mockInvoices)

  await testApiHandler({
    handler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: 'GET' })

      expect(response.status).toBe(200)

      const data = await response.json()

      expect(data).toEqual({
        data: {
          invoices: expect.arrayContaining(
            JSON.parse(JSON.stringify(mockInvoices.map(invoiceDetailToSummary)))
          ),
        },
      })
    },
  })
})

it('should post a pending invoice', async () => {
  expect.hasAssertions()

  const initialInvoices = [buildMockInvoiceDetail(), buildMockInvoiceDetail()]

  await database.seedInvoices(...initialInvoices)

  await testApiHandler({
    handler,
    test: async ({ fetch }) => {
      const initialGetReponse = await fetch()
      const initialGetData = await initialGetReponse.json()

      // we should get the original seeded data
      expect(initialGetData).toEqual({
        data: {
          invoices: expect.arrayContaining(
            JSON.parse(
              JSON.stringify(initialInvoices.map(invoiceDetailToSummary))
            )
          ),
        },
      })

      const newInvoiceInput = buildMockPendingInvoiceInput()

      const response = await fetch({
        method: 'POST',
        body: JSON.stringify(newInvoiceInput),
        headers: {
          'content-type': 'application/json',
        },
      })

      expect(response.status).toBe(201)

      const result = await response.json()

      // a post request should give us back the full saved invoice object
      const mockInvoiceDetail = invoiceDetailFromInput(newInvoiceInput)
      expect(result).toMatchObject({
        data: {
          savedInvoice: {
            ...JSON.parse(JSON.stringify(mockInvoiceDetail)),
            id: expect.stringMatching(idRegex),
            itemList: expect.toIncludeSameMembers(
              mockInvoiceDetail.itemList.map((mockItem) => ({
                ...mockItem,
                id: expect.any(Number),
              }))
            ),
          },
        },
      })

      const finalGetResponse = await fetch()
      const finalGetData = await finalGetResponse.json()

      // expect to receive back our original two invoices, plus the new one
      expect(finalGetData).toEqual({
        data: {
          invoices: expect.arrayContaining([
            ...JSON.parse(
              JSON.stringify(initialInvoices.map(invoiceDetailToSummary))
            ),
            expect.objectContaining({
              clientName: newInvoiceInput.clientName,
            }),
          ]),
        },
      })
    },
  })
})