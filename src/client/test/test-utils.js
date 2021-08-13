import { QueryClient, QueryClientProvider } from 'react-query'

import { render as rtlRender } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

function Providers({ children }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

function render(ui, options = {}) {
  return rtlRender(ui, { wrapper: Providers, ...options })
}

export * from '@testing-library/react'
export { render, userEvent }
