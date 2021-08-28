import * as invoiceController from './invoice.controller'
import * as invoiceModel from './invoice.model'

import { NewInvoiceInputDTO, Stringify } from 'src/shared/dtos'
import {
  buildMockDraftInvoiceInput,
  buildMockInvoiceSummary,
} from '../../test/mocks/invoice.fixtures'

import { generateInvoiceId } from 'src/client/shared/utils'
import { mocked } from 'ts-jest/utils'

jest.mock('./invoice.model')

const mockInvoiceModel = mocked(invoiceModel, true)

afterEach(() => {
  jest.resetAllMocks()
})

describe('getInvoices', () => {
  it('should get invoices', async () => {
    const mockInvoices = [
      buildMockInvoiceSummary(),
      buildMockInvoiceSummary(),
      buildMockInvoiceSummary(),
    ]

    mockInvoiceModel.findAll.mockResolvedValueOnce(mockInvoices)

    const result = await invoiceController.getInvoices()

    expect(result.code).toBe(200)
    expect(result.response).toMatchObject({
      data: {
        invoices: mockInvoices,
      },
    })

    expect(mockInvoiceModel.findAll).toHaveBeenCalledTimes(1)
    expect(mockInvoiceModel.findAll).toHaveBeenCalledWith()
  })

  it('should handle an unexpected database error', async () => {
    const mockError = new Error('Some error message')
    mockInvoiceModel.findAll.mockRejectedValueOnce(mockError)

    const result = await invoiceController.getInvoices()

    expect(result.code).toBe(500)
    expect(result.response).toEqual({
      error: JSON.stringify(mockError),
    })
  })
})

describe('postInvoice', () => {
  it('should post valid draft invoice', async () => {
    const mockDraftInvoiceInput = buildMockDraftInvoiceInput()
    const dtoInput = JSON.parse(
      JSON.stringify(mockDraftInvoiceInput)
    ) as Stringify<NewInvoiceInputDTO>
    const mockSavedInvoice = {
      ...mockDraftInvoiceInput,
      id: generateInvoiceId(),
    }

    mockInvoiceModel.create.mockResolvedValueOnce(mockSavedInvoice)

    const result = await invoiceController.postInvoice(dtoInput)

    expect(result.code).toBe(201)
    expect(result.response).toMatchObject({
      data: {
        savedInvoice: mockSavedInvoice,
      },
    })

    expect(mockInvoiceModel.create).toHaveBeenCalledTimes(1)
    expect(mockInvoiceModel.create).toHaveBeenCalledWith(mockDraftInvoiceInput)
  })

  it('should handle an unexpected database error', async () => {
    const mockError = new Error('Some error message')
    mockInvoiceModel.create.mockRejectedValueOnce(mockError)

    const mockDraftInvoiceInput = buildMockDraftInvoiceInput()
    const dtoInput = JSON.parse(
      JSON.stringify(mockDraftInvoiceInput)
    ) as Stringify<NewInvoiceInputDTO>

    const result = await invoiceController.postInvoice(dtoInput)

    expect(result.code).toBe(500)
    expect(result.response).toEqual({
      error: JSON.stringify(mockError),
    })
  })
})
