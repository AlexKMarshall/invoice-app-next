import { currencyFormatter } from './currency'

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
