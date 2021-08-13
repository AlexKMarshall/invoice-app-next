export function randomDigit() {
  return Math.floor(Math.random() * 10)
}

export function randomLetter() {
  const randomOffset = Math.floor(Math.random() * 26)
  const startCode = 'A'.charCodeAt(0)
  const charCode = startCode + randomOffset
  return String.fromCharCode(charCode)
}

export function generateInvoiceId(): string {
  const characters = [
    randomLetter(),
    randomLetter(),
    randomDigit(),
    randomDigit(),
    randomDigit(),
    randomDigit(),
  ]

  return characters.join('')
}

export const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
})
