export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message)
  }
}

export class ActionNotPermittedError extends Error {
  constructor(message?: string) {
    super(message)
  }
}
