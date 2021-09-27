import { toArray } from './array'

describe('toArray', () => {
  it('should return this input if given an array', () => {
    const input = ['a', 'b']
    const result = toArray(input)

    expect(result).toBe(input)
  })

  it('should return the input wrapped in an array if given anything not an array', () => {
    const input = 'cat'
    const result = toArray(input)

    expect(result).toEqual([input])
  })
})
