import {
  currencyFormatter,
  generateInvoiceId,
  randomDigit,
  randomLetter,
} from './utils'

describe('randomDigit', () => {
  it('should generate random number between 0 and 9', () => {
    const result = randomDigit()

    expect(result).toBeLessThanOrEqual(9)
    expect(result).toBeGreaterThanOrEqual(0)
  })
})

describe('randomLetter', () => {
  it('should generate random letter between A and Z', () => {
    const result = randomLetter()

    expect(result).toEqual(expect.stringMatching(/[A-Z]/))
  })
})

describe('generateInvoiceId', () => {
  it('should generate invoice in format AB1234', () => {
    const result = generateInvoiceId()

    expect(result).toMatch(/^[A-Z]{2}\d{4}$/)
  })
})

describe('currencyFormatter', () => {
  it('should format as GBP', () => {
    const testCases = [
      {
        label: 'poundsOnly',
        input: 250,
        expected: '£250.00',
      },
      { label: 'pennies', input: 0.57, expected: '£0.57' },
      { label: 'thousands', input: 1234.56, expected: '£1,234.56' },
    ]

    testCases.forEach(({ input, expected }) => {
      const result = currencyFormatter.format(input)
      expect(result).toEqual(expected)
    })
  })
})
