import * as invoiceController from './invoice.controller'
import * as invoiceModel from './invoice.model'

import { NewInvoiceInputDTO, Stringify } from 'src/shared/dtos'
import {
  buildMockCompleteInvoiceInput,
  buildMockDraftInvoiceInput,
  buildMockInvoiceDetail,
  buildMockPendingInvoiceInput,
} from '../../test/mocks/invoice.fixtures'

import { mocked } from 'ts-jest/utils'

jest.mock('./invoice.model')

const mockInvoiceModel = mocked(invoiceModel, true)

afterEach(() => {
  jest.resetAllMocks()
})

describe('getInvoices', () => {
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
  it('should allow draft input with optional fields', async () => {
    mockInvoiceModel.create.mockResolvedValueOnce(buildMockInvoiceDetail())
    const mockInput = buildMockDraftInvoiceInput({
      clientName: '',
      clientEmail: '',
      projectDescription: '',
    })
    const dtoInput = JSON.parse(JSON.stringify(mockInput))

    const result = await invoiceController.postInvoice(dtoInput)
    expect(result.code).toBe(201)
    expect(result.response).toMatchObject({
      data: {
        savedInvoice: expect.objectContaining({}),
      },
    })
  })
  it('should return error when pending input has empty strings', async () => {
    const mockInput = buildMockPendingInvoiceInput({
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
          clientName: ["can't be empty"],
          clientEmail: ["can't be empty", 'Invalid email'],
          clientAddress: {
            street: ["can't be empty"],
            city: ["can't be empty"],
            country: ["can't be empty"],
            postcode: ["can't be empty"],
          },
          senderAddress: {
            street: ["can't be empty"],
            city: ["can't be empty"],
            country: ["can't be empty"],
            postcode: ["can't be empty"],
          },
          projectDescription: ["can't be empty"],
          itemList: {
            '0': {
              name: ["can't be empty"],
            },
          },
        },
      },
    })
  })

  it('should return error on invalid numbers', async () => {
    const mockInput = buildMockCompleteInvoiceInput({
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
