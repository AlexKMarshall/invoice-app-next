import * as invoiceController from './invoice.controller'
import * as invoiceModel from './invoice.model'

import { NewInvoiceInputDTO, Stringify } from 'src/shared/dtos'
import {
  buildMockDraftInvoiceInput,
  buildMockInvoiceInput,
  buildMockInvoiceSummary,
} from '../../test/mocks/invoice.fixtures'

import { generateId } from 'src/client/shared/identifier'
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
      id: generateId(),
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
  it('should return error when input has empty strings', async () => {
    const mockInput = buildMockInvoiceInput({
      clientName: '',
      clientEmail: '',
      clientAddress: {
        street: '',
        city: '',
        postcode: '',
        country: '',
      },
      senderAddress: {
        street: '',
        city: '',
        postcode: '',
        country: '',
      },
      projectDescription: '',
      itemList: [{ name: '' }],
    })
    const dtoInput = JSON.parse(JSON.stringify(mockInput))

    const result = await invoiceController.postInvoice(dtoInput)

    expect(result.code).toBe(400)
    expect(result.response).toEqual({
      error: {
        fieldErrors: {
          clientName: ['Should be at least 1 characters'],
          clientEmail: ['Invalid email'],
          clientAddress: {
            street: ['Should be at least 1 characters'],
            city: ['Should be at least 1 characters'],
            country: ['Should be at least 1 characters'],
            postcode: ['Should be at least 1 characters'],
          },
          senderAddress: {
            street: ['Should be at least 1 characters'],
            city: ['Should be at least 1 characters'],
            country: ['Should be at least 1 characters'],
            postcode: ['Should be at least 1 characters'],
          },
          projectDescription: ['Should be at least 1 characters'],
          itemList: {
            '0': {
              name: ['Should be at least 1 characters'],
            },
          },
        },
      },
    })
  })

  it('should return error on invalid numbers', async () => {
    const mockInput = buildMockInvoiceInput({
      paymentTerms: -1,
      itemList: [{ quantity: 0, price: -1 }],
    })
    const dtoInput = JSON.parse(JSON.stringify(mockInput))

    const result = await invoiceController.postInvoice(dtoInput)

    expect(result.code).toBe(400)
    expect(result.response).toEqual({
      error: {
        fieldErrors: {
          paymentTerms: ['Value should be greater than or equal to 0'],
          itemList: {
            '0': {
              quantity: ['Value should be greater than or equal to 1'],
              price: ['Value should be greater than or equal to 0'],
            },
          },
        },
      },
    })
  })
})
