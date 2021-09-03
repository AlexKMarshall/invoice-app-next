function randomDigit(): number {
  return Math.floor(Math.random() * 10)
}

function randomLetter(): string {
  const randomOffset = Math.floor(Math.random() * 26)
  const startCode = 'A'.charCodeAt(0)
  const charCode = startCode + randomOffset
  return String.fromCharCode(charCode)
}

export function generateId(): string {
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

export const idRegex = /[A-Z]{2}\d{4}/
