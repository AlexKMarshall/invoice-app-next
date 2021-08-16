import 'src/client/shared/styles/globals.css'

import { QueryClient, QueryClientProvider } from 'react-query'

import { AppProps } from 'next/app'
import { SSRProvider } from '@react-aria/ssr'

const queryClient = new QueryClient()

if (
  process.env.NEXT_PUBLIC_API_MOCKING === 'enabled' &&
  typeof window !== 'undefined'
) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { worker } = require('src/client/test/mocks/browser')
  worker.start()
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SSRProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </SSRProvider>
  )
}

export default MyApp
