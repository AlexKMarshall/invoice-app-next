function randomDigit(): number {
  return Math.floor(Math.random() * 10)
}

function randomLetter(): string {
  const randomOffset = Math.floor(Math.random() * 26)
  const startCode = 'A'.charCodeAt(0)
  const charCode = startCode + randomOffset
  return String.fromCharCode(charCode)
}

export function generateAlphanumericId(): string {
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

export function generateNumericId(): number {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}

export const idRegex = /[A-Z]{2}\d{4}/
