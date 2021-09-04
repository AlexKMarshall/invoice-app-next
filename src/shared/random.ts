export function randomPick<T>(array: ReadonlyArray<T>): T {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

export function maybeUndefinedFactory(
  probUndefined: number
): <T>(value: T) => T | undefined {
  return <T>(value: T) => {
    return Math.random() < probUndefined ? undefined : value
  }
}

export const maybeUndefined = maybeUndefinedFactory(0.5)
