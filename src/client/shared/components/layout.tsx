import { ReactNode } from 'react'
import { Sidebar as SidebarBase } from './sidebar'
import styled from 'styled-components'
import { useDrawer } from './drawer'

type Props = {
  children: ReactNode
}

export function Layout({ children }: Props): JSX.Element {
  const { drawerRef } = useDrawer()
  return (
    <LayoutWrapper>
      <MainWrapper>{children}</MainWrapper>
      <DrawerWrapper ref={drawerRef}></DrawerWrapper>

      <Sidebar />
    </LayoutWrapper>
  )
}

const LayoutWrapper = styled.div`
  min-height: 100vh;

  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: 'sidebar content';
`

const MainWrapper = styled.div`
  isolation: isolate;
  display: flex;
  justify-content: center;
  grid-area: content;
`

const DrawerWrapper = styled.div`
  position: fixed;
  /* top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: salmon;
  opacity: 50%; */
  grid-column: 1 / -1;
`

const Sidebar = styled(SidebarBase)`
  grid-area: sidebar;
`
