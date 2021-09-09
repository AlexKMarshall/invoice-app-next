import { maybeFactory, randomPick } from './random'

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
describe('maybe', () => {
  it('should return alternate value based on probability', () => {
    const otherValue = {
      b: 'different',
    }
    const maybeUndefined = maybeFactory(1, otherValue)
    expect(maybeUndefined('any value')).toBe(otherValue)
  })
  it('should return passed in value based on inverse of probability', () => {
    const maybeUndefined = maybeFactory(0, undefined)
    const expectedValue = { a: 'any value' }
    expect(maybeUndefined(expectedValue)).toBe(expectedValue)
  })
})
