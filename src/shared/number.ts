export function round(precision: number, value: number): number {
  const exponent = 10 ** precision
  return Math.round(value * exponent) / exponent
}

export function round2dp(value: number): number {
  return round(2, value)
}
