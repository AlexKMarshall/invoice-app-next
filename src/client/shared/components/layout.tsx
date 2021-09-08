import { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import styled from 'styled-components'

type Props = {
  children: ReactNode
}

export function Layout({ children }: Props): JSX.Element {
  return (
    <Wrapper>
      {children}
      <Sidebar />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid-template-areas: 'screen';

  & > * {
    grid-area: screen;
  }
`
