import { generateId, idRegex } from './identifier'

describe('generateId', () => {
  it('should generate invoice in format AB1234', () => {
    const result = generateId()

    expect(result).toHaveLength(6)
    expect(result).toMatch(idRegex)
  })
})
