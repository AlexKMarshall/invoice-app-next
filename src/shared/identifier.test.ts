import {
  generateAlphanumericId,
  generateNumericId,
  idRegex,
} from './identifier'

describe('generateAlphanumericId', () => {
  it('should generate identifier in format AB1234', () => {
    const result = generateAlphanumericId()

    expect(result).toHaveLength(6)
    expect(result).toMatch(idRegex)
  })
})

describe('generateNumericId', () => {
  it('should generate positive number', () => {
    const result = generateNumericId()
    expect(result).toBePositive()
  })
})
