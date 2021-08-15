import { QueryClient, QueryClientProvider } from 'react-query'

import { AppProps } from 'next/app'
import { SSRProvider } from '@react-aria/ssr'
import { createGlobalStyle } from 'styled-components'

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
        <GlobalStyle />
        <Component {...pageProps} />
      </QueryClientProvider>
    </SSRProvider>
  )
}

export default MyApp

const CSSReset = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  body,
  h1,
  h2,
  h3,
  h4,
  p,
  figure,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  ul[role='list'],
  ol[role='list'] {
    list-style: none;
  }

  body {
    min-height: 100vh;
    text-rendering: optimizeSpeed;
    line-height: 1.5;
  }

  a:not([class]) {
    text-decoration-skip-ink: auto;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  @media (prefers-reduced-motion: reduce) {
    html:focus-within {
      scroll-behavior: auto;
    }

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Spartan', sans-serif;
    font-size: ${12 / 16}rem;
    font-weight: 500;
    letter-spacing: -0.25px;

    background-color: hsla(240deg, 27%, 98%, 100%);
    color: hsla(231deg, 37%, 63%, 1);
  }
`
