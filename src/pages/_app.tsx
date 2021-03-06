import 'src/client/shared/styles/global.css'
import 'src/client/shared/styles/reset.css'

import {
  ConfirmationDialogProvider,
  DrawerContainer,
  DrawerOverlayContainer,
  DrawerProvider,
} from 'src/client/shared/components'
import { QueryClient, QueryClientProvider } from 'react-query'

import { AppProps } from 'next/app'
import { Layout } from 'src/client/shared/components/layout'
import { OverlayProvider } from '@react-aria/overlays'
import { SSRProvider } from '@react-aria/ssr'
import { ScreenReaderNotificationProvider } from 'src/client/shared/components/screen-reader-notification'

if (
  process.env.NEXT_PUBLIC_API_MOCKING === 'enabled' &&
  typeof window !== 'undefined'
) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { worker } = require('src/client/test/mocks/browser')
  worker.start()
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const queryClient = new QueryClient()

  return (
    <SSRProvider>
      <QueryClientProvider client={queryClient}>
        <ConfirmationDialogProvider>
          <OverlayProvider>
            <DrawerProvider>
              <Layout>
                <ScreenReaderNotificationProvider>
                  <DrawerOverlayContainer>
                    <Component {...pageProps} />
                  </DrawerOverlayContainer>
                  <DrawerContainer />
                </ScreenReaderNotificationProvider>
              </Layout>
            </DrawerProvider>
          </OverlayProvider>
        </ConfirmationDialogProvider>
      </QueryClientProvider>
    </SSRProvider>
  )
}

export default MyApp
