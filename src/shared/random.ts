export function randomPick<T>(array: ReadonlyArray<T>): T {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

export function maybeFactory<U extends unknown>(
  probability: number,
  alternate: U
): <T>(value: T) => T | U {
  return <T>(value: T) => {
    return Math.random() < probability ? alternate : value
  }
}

export const maybeEmpty = maybeFactory(0.5, '')
