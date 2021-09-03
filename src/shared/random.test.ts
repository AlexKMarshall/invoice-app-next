import { randomPick } from './random'

describe('randomPick', () => {
  it('should return a random member of an array of literals', () => {
    // if we pass it a literal it should be happy
    const literalValues = ['a', 'b', 'c'] as const
    type Literal = typeof literalValues[number]
    const literalResult: Literal = randomPick(literalValues)

    expect(literalValues.includes(literalResult)).toBe(true)
  })
  it('should return a random member of a regular array', () => {
    const regularValues: string[] = ['x', 'y', 'z']
    const regularResult: string = randomPick(regularValues)

    expect(regularValues.includes(regularResult)).toBe(true)
  })
})
