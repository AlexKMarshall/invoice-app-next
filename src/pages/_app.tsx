import {
  DrawerContainer,
  DrawerOverlayContainer,
  DrawerProvider,
} from 'src/client/shared/components/drawer'
import { QueryClient, QueryClientProvider } from 'react-query'

import { AppProps } from 'next/app'
import { Global as CSSGlobal } from 'src/client/shared/styles/global'
import { Reset as CSSReset } from 'src/client/shared/styles/reset'
import { Layout } from 'src/client/shared/components/layout'
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
        <CSSReset />
        <CSSGlobal />
        <DrawerProvider>
          <Layout>
            <DrawerOverlayContainer>
              <Component {...pageProps} />
            </DrawerOverlayContainer>
            <DrawerContainer />
          </Layout>
        </DrawerProvider>
      </QueryClientProvider>
    </SSRProvider>
  )
}

export default MyApp
