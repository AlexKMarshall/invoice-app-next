import {
  buildMockDraftInvoiceInput,
  buildMockInvoiceSummary,
} from 'src/server/test/mocks/invoice.fixtures'
import { disconnect, seedInvoiceSummaries } from 'src/server/database'

import { execSync } from 'child_process'
import handler from 'src/pages/api/invoices'
import { testApiHandler } from 'next-test-api-route-handler'

let dbFileName: string

beforeAll(async () => {
  dbFileName = `test-${process.env.JEST_WORKER_ID}`
  const dbUrl = `file:./${dbFileName}.db`
  process.env.DATABASE_URL = dbUrl

  const command = `DATABASE_URL=${dbUrl} npx prisma migrate deploy`

  execSync(command)
})

afterAll(async () => {
  await disconnect()
})

it('should get invoices', async () => {
  expect.hasAssertions()

  const mockInvoices = [buildMockInvoiceSummary(), buildMockInvoiceSummary()]

  await seedInvoiceSummaries(...mockInvoices)

  await testApiHandler({
    handler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: 'GET' })
      const data = await response.json()

      expect(data).toEqual({
        data: {
          invoices: JSON.parse(JSON.stringify(mockInvoices)),
        },
      })
    },
  })
})

it('should post a draft invoice', async () => {
  expect.hasAssertions()

  const mockInvoices = [buildMockInvoiceSummary(), buildMockInvoiceSummary()]

  await seedInvoiceSummaries(...mockInvoices)

  await testApiHandler({
    handler,
    test: async ({ fetch }) => {
      const initialInvoicesReponse = await fetch()
      const initialInvoicesData = await initialInvoicesReponse.json()

      expect(initialInvoicesData).toEqual({
        data: {
          invoices: JSON.parse(JSON.stringify(mockInvoices)),
        },
      })

      const newInvoiceInput = buildMockDraftInvoiceInput()

      const response = await fetch({
        method: 'POST',
        body: JSON.stringify(newInvoiceInput),
        headers: {
          'content-type': 'application/json',
        },
      })

      const result = await response.json()

      expect(result).toEqual({
        data: {
          savedInvoice: {
            ...JSON.parse(JSON.stringify(newInvoiceInput)),
            itemList: expect.arrayContaining(
              JSON.parse(JSON.stringify(newInvoiceInput.itemList))
            ),
            id: expect.stringMatching(/[A-Z]{2}\d{4}/),
          },
        },
      })

      // const finalGetResponse = await fetch()
      // const finalGetData = await finalGetResponse.json()

      // expect(finalGetData).toEqual({
      //   data: {
      //     invoices: expect.arrayContaining([
      //       ...JSON.parse(JSON.stringify(mockInvoices)),
      //       // expect.objectContaining({
      //       //   clientName: newInvoiceInput.clientName,
      //       // }),
      //     ]),
      //   },
      // })
    },
  })
})
