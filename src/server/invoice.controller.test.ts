import * as invoiceController from './invoice.controller'
import * as invoiceModel from './invoice.model'

import { buildMockInvoiceSummary } from './test/mocks/invoice.fixtures'
import { mocked } from 'ts-jest/utils'

jest.mock('./invoice.model')

const mockInvoiceModel = mocked(invoiceModel, true)

afterEach(() => {
  jest.resetAllMocks()
})

it('should get invoices', async () => {
  const mockInvoices = [
    buildMockInvoiceSummary(),
    buildMockInvoiceSummary(),
    buildMockInvoiceSummary(),
  ]

  mockInvoiceModel.findAll.mockResolvedValueOnce(mockInvoices)

  const result = await invoiceController.getInvoices()

  expect(result).toMatchObject({
    data: {
      invoices: mockInvoices,
    },
  })
})
