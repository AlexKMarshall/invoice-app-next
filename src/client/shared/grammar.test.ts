import { inflect } from './grammar'

describe('inflect', () => {
  test.each([
    { singular: 'cat', plural: undefined, count: 0, expected: 'cats' },
    { singular: 'cat', plural: undefined, count: 1, expected: 'cat' },
    { singular: 'cat', plural: undefined, count: 2, expected: 'cats' },
    { singular: 'sheep', plural: 'sheep', count: 0, expected: 'sheep' },
    { singular: 'sheep', plural: 'sheep', count: 1, expected: 'sheep' },
    { singular: 'sheep', plural: 'sheep', count: 2, expected: 'sheep' },
    { singular: 'person', plural: 'people', count: 0, expected: 'people' },
    { singular: 'person', plural: 'people', count: 1, expected: 'person' },
    { singular: 'person', plural: 'people', count: 2, expected: 'people' },
  ])(
    'inflect($singular, $plural)($count)',
    ({ singular, plural, count, expected }) => {
      expect(inflect(singular, plural)(count)).toBe(expected)
    }
  )
})
