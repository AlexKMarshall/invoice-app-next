import {
  buildMockDraftInvoiceInput,
  buildMockInvoiceDetail,
} from 'src/server/test/mocks/invoice.fixtures'
import { disconnect, seedInvoices } from 'src/server/database'

import { deleteDatabase } from 'prisma/utils'
import { execSync } from 'child_process'
import handler from 'src/pages/api/invoices'
import { invoiceDetailToSummary } from 'src/server/features/invoice/invoice.mappers'
import { testApiHandler } from 'next-test-api-route-handler'

let dbFileName: string

beforeEach(async () => {
  dbFileName = `test-${process.env.JEST_WORKER_ID}`
  const dbUrl = `file:./${dbFileName}.db`
  process.env.DATABASE_URL = dbUrl

  const command = `DATABASE_URL=${dbUrl} npx prisma migrate deploy`

  execSync(command)
})

afterEach(async () => {
  await disconnect()
  deleteDatabase(dbFileName)
})

it('should get invoices', async () => {
  expect.hasAssertions()

  const mockInvoices = [buildMockInvoiceDetail(), buildMockInvoiceDetail()]

  await seedInvoices(...mockInvoices)

  await testApiHandler({
    handler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: 'GET' })
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

it('should post a draft invoice', async () => {
  expect.hasAssertions()

  const initialInvoices = [buildMockInvoiceDetail(), buildMockInvoiceDetail()]

  await seedInvoices(...initialInvoices)

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

      const newInvoiceInput = buildMockDraftInvoiceInput()

      const response = await fetch({
        method: 'POST',
        body: JSON.stringify(newInvoiceInput),
        headers: {
          'content-type': 'application/json',
        },
      })

      const result = await response.json()

      // a post request should give us back the full saved invoice object
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
