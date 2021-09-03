export function randomPick<T>(array: ReadonlyArray<T>): T {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}
