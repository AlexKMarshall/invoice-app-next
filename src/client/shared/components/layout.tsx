import { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import styled from 'styled-components'

type Props = {
  children: ReactNode
}

export function Layout({ children }: Props): JSX.Element {
  return (
    <LayoutWrapper>
      <Sidebar />
      {children}
    </LayoutWrapper>
  )
}

const LayoutWrapper = styled.div`
  min-height: 100vh;

  display: grid;
  grid-template-columns: auto 1fr;
`
