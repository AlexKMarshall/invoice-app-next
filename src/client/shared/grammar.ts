export function inflect(singular: string, plural = `${singular}s`) {
  return (quantity: number): string =>
    Math.abs(quantity) === 1 ? singular : plural
}
