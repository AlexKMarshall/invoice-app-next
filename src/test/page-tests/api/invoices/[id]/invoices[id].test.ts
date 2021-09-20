import {
  buildMockInvoiceDetail,
  buildMockInvoiceInput,
} from 'src/server/test/mocks/invoice.fixtures'
import { database, prepareDbForTests } from 'src/server/test/test-utils'

import { generateAlphanumericId } from 'src/shared/identifier'
import handler from 'src/pages/api/invoices/[id]'
import { invoiceDetailFromInput } from 'src/server/features/invoice/invoice.mappers'
import invoicesHandler from 'src/pages/api/invoices'
import { randomPick } from 'src/shared/random'
import { testApiHandler } from 'next-test-api-route-handler'

prepareDbForTests()

it('should get individual invoice detail', async () => {
  expect.hasAssertions()

  const expectedInvoiceDetail = buildMockInvoiceDetail()

  const mockInvoices = [expectedInvoiceDetail, buildMockInvoiceDetail()]

  await database.seedInvoices(...mockInvoices)

  await testApiHandler({
    handler,
    params: { id: expectedInvoiceDetail.id },
    test: async ({ fetch }) => {
      const response = await fetch({ method: 'GET' })

      expect(response.status).toBe(200)

      const data = await response.json()

      expect(data).toEqual({
        data: {
          invoice: {
            ...JSON.parse(JSON.stringify(expectedInvoiceDetail)),
            // we don't care about the order of the itemList array or their ids
            itemList: expect.toIncludeSameMembers(
              expectedInvoiceDetail.itemList.map((mockItem) => ({
                ...mockItem,
                id: expect.any(Number),
              }))
            ),
          },
        },
      })
    },
  })
})
it('should return 404 if no invoice for given id', async () => {
  expect.hasAssertions()

  const nonExistantId = generateAlphanumericId()

  await testApiHandler({
    handler,
    params: { id: nonExistantId },
    test: async ({ fetch }) => {
      const response = await fetch({ method: 'GET' })

      expect(response.status).toBe(404)

      const data = await response.json()

      expect(data).toEqual({
        error: expect.stringMatching(
          new RegExp(`cannot find invoice with id '${nonExistantId}'`, 'i')
        ),
      })
    },
  })
})
it('should allow updating a pending invoice', async () => {
  expect.hasAssertions()

  const existingInvoice = buildMockInvoiceDetail({ status: 'pending' })
  await database.seedInvoices(existingInvoice)

  const updatedInvoiceInput = buildMockInvoiceInput({ status: 'pending' })

  const updatedInvoiceDetail = invoiceDetailFromInput(
    updatedInvoiceInput,
    existingInvoice.id
  )

  await testApiHandler({
    handler,
    params: { id: existingInvoice.id },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'PUT',
        body: JSON.stringify(updatedInvoiceInput),
        headers: { 'content-type': 'application/json' },
      })

      expect(response.status).toBe(200)

      const data = await response.json()

      expect(data).toEqual({
        data: {
          updatedInvoice: {
            ...JSON.parse(JSON.stringify(updatedInvoiceDetail)),
            // we don't care about the order of the itemList array or their ids
            itemList: expect.toIncludeSameMembers(
              updatedInvoiceDetail.itemList.map((mockItem) => ({
                ...mockItem,
                id: expect.any(Number),
              }))
            ),
          },
        },
      })
    },
  })
})
it('should allow draft invoices to be updated to pending', async () => {
  expect.hasAssertions()

  const existingDraftInvoice = buildMockInvoiceDetail({ status: 'draft' })
  await database.seedInvoices(existingDraftInvoice)

  const updatedInvoiceInput = buildMockInvoiceInput({ status: 'pending' })

  const updatedInvoiceDetail = invoiceDetailFromInput(
    updatedInvoiceInput,
    existingDraftInvoice.id
  )

  await testApiHandler({
    handler,
    params: { id: existingDraftInvoice.id },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'PUT',
        body: JSON.stringify(updatedInvoiceInput),
        headers: { 'content-type': 'application/json' },
      })

      expect(response.status).toBe(200)

      const data = await response.json()

      expect(data).toEqual({
        data: {
          updatedInvoice: {
            ...JSON.parse(JSON.stringify(updatedInvoiceDetail)),
            // we don't care about the order of the itemList array or their ids
            itemList: expect.toIncludeSameMembers(
              updatedInvoiceDetail.itemList.map((mockItem) => ({
                ...mockItem,
                id: expect.any(Number),
              }))
            ),
          },
        },
      })
    },
  })
})
it('should not allow pending invoices to be updated to draft', async () => {
  expect.hasAssertions()

  const existingPendingInvoice = buildMockInvoiceDetail({ status: 'pending' })
  await database.seedInvoices(existingPendingInvoice)

  const updatedInvoiceInput = buildMockInvoiceInput({ status: 'draft' })

  const updatedInvoiceDetail = invoiceDetailFromInput(
    updatedInvoiceInput,
    existingPendingInvoice.id
  )

  await testApiHandler({
    handler,
    params: { id: existingPendingInvoice.id },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'PUT',
        body: JSON.stringify(updatedInvoiceInput),
        headers: { 'content-type': 'application/json' },
      })

      expect(response.status).toBe(403)

      const data = await response.json()

      expect(data).toEqual({
        error: `Cannot update invoice ${existingPendingInvoice.id} from pending to draft`,
      })
    },
  })
})
it('should allow deleting an invoice', async () => {
  expect.hasAssertions()

  const invoiceToDelete = buildMockInvoiceDetail({
    status: randomPick(['draft', 'pending']),
  })
  await database.seedInvoices(invoiceToDelete)

  await testApiHandler({
    handler,
    params: { id: invoiceToDelete.id },
    test: async ({ fetch }) => {
      const response = await fetch({ method: 'DELETE' })

      expect(response.status).toBe(200)

      const data = await response.json()

      expect(data).toEqual({
        data: {
          deletedInvoice: {
            ...JSON.parse(JSON.stringify(invoiceToDelete)),
            // we don't care about the order of the itemList array or their ids
            itemList: expect.toIncludeSameMembers(
              invoiceToDelete.itemList.map((mockItem) => ({
                ...mockItem,
                id: expect.any(Number),
              }))
            ),
          },
        },
      })
    },
  })

  // now load the /api/invoices route to check that invoice is not there
  await testApiHandler({
    handler: invoicesHandler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: 'GET' })

      expect(response.status).toBe(200)

      const data = await response.json()

      expect(data).toEqual({ data: { invoices: [] } })
    },
  })
})
