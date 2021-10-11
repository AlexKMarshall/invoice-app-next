import { EmptyObject } from 'src/shared/type-utils'
import { Stringify } from 'src/shared/dtos'

type ClientOptions<TData> = RequestInit & {
  data?: TData
}

export async function client<TResponse, TBody = EmptyObject>(
  endpoint: string,
  { data, headers: customHeaders, ...customOptions }: ClientOptions<TBody> = {}
): Promise<Stringify<TResponse>> {
  const requestOptions: RequestInit = {}
  const requestHeaders: HeadersInit = {}

  if (data) {
    Object.assign(requestOptions, {
      body: JSON.stringify(data),
      method: 'POST',
    })
    Object.assign(requestHeaders, { 'content-type': 'application/json' })
  }

  Object.assign(requestHeaders, customHeaders)
  Object.assign(requestOptions, { headers: requestHeaders }, customOptions)

  const res = await fetch(endpoint, requestOptions)
  const responseData: Stringify<TResponse> = await res.json()
  return responseData
}
