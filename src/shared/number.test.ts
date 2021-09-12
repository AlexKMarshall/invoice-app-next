import { round } from './number'

describe('round', () => {
  test.each([
    { value: 1.567, precision: 2, expected: 1.57 },
    { value: 1.543, precision: 2, expected: 1.54 },
    { value: 1.567, precision: 0, expected: 2 },
  ])(
    'round $value to $precision decimal places',
    ({ value, precision, expected }) => {
      expect(round(precision, value)).toBe(expected)
    }
  )
})
