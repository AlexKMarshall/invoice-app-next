import { ReactNode, createContext, useContext, useMemo, useState } from 'react'

import { screenReaderOnly } from 'src/client/shared/styles/accessibility.css'

type ScreenReaderNotificationContext = {
  notify: (message: string) => void
}

const ScreenReaderNotificationContext =
  createContext<ScreenReaderNotificationContext | null>(null)

export function useScreenReaderNotification(): ScreenReaderNotificationContext {
  const context = useContext(ScreenReaderNotificationContext)
  if (!context)
    throw new Error(
      'useScreenReaderNotification must be used within a <ScreenReaderNotificationProvider>'
    )
  return context
}

type Props = {
  children: ReactNode
}
export function ScreenReaderNotificationProvider({
  children,
}: Props): JSX.Element {
  const [message, setMessage] = useState('')

  const value = useMemo(
    () => ({
      notify: (message: string) => setMessage(message),
    }),
    []
  )

  return (
    <ScreenReaderNotificationContext.Provider value={value}>
      {children}
      <div role="status" aria-live="polite" className={screenReaderOnly}>
        {message}
      </div>
    </ScreenReaderNotificationContext.Provider>
  )
}
