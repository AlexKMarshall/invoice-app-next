import { ActionNotPermittedError, NotFoundError } from './errors'

export type ControllerResponse<TData = unknown> = Promise<
  ControllerSuccessResponse<TData> | ControllerErrorResponse
>

type ControllerSuccessResponse<TData = unknown> = {
  code: number
  response: TData
}

type ControllerErrorResponse<TError = unknown> = {
  code: number
  response: {
    error: TError
  }
}

function errorHandler(error: unknown): ControllerErrorResponse {
  if (error instanceof NotFoundError) {
    return { code: 404, response: { error: error.message } }
  }
  if (error instanceof ActionNotPermittedError) {
    return { code: 403, response: { error: error.message } }
  }
  return {
    code: 500,
    response: { error: JSON.stringify(error) },
  }
}

export function withErrorHandler<TArgs extends Array<unknown>, TResult>(
  func: (...args: TArgs) => Promise<TResult>
): (...args: TArgs) => Promise<TResult | ControllerErrorResponse> {
  return (...args: TArgs) => func(...args).catch(errorHandler)
}
