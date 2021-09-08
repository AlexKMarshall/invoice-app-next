import { COLORS } from '../styles/theme'
import Image from 'next/image'
import { Logo } from '../icons/logo'
import { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
  children: ReactNode
}

export function Layout({ children }: Props): JSX.Element {
  return (
    <Wrapper>
      <Main>{children}</Main>
      <Sidebar />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: 'sidebar main';
`

const Main = styled.main`
  max-width: 730px;
  margin-left: auto;
  margin-right: auto;
  grid-area: main;
`

function Sidebar(): JSX.Element {
  return (
    <SidebarWrapper>
      <LogoBox>
        <Logo />
      </LogoBox>
      <AvatarBox>
        <AvatarImageWrapper>
          <Image
            src="/image-avatar.jpg"
            alt="man in a black rollneck shirt and orange beanie"
            height={40}
            width={40}
          />
        </AvatarImageWrapper>
      </AvatarBox>
    </SidebarWrapper>
  )
}

const SidebarWrapper = styled.div`
  --border-radius: 20px;
  height: 100vh;
  width: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-area: sidebar;

  background: ${COLORS.sidebarColor.prop};
  position: sticky;
  top: 0;
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  overflow: hidden;
`

const LogoBox = styled.div`
  padding: 1.5rem 2rem;
  background-color: ${COLORS.primaryColor.prop};
  margin-bottom: auto;
  position: relative;
  overflow: hidden;
  border-bottom-right-radius: var(--border-radius);
  z-index: -2;

  & > svg {
    width: 40px;
  }

  &:after {
    content: '';
    position: absolute;
    background-color: ${COLORS.primaryColor.light.prop};
    border-top-left-radius: var(--border-radius);
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    transform: translateY(50%);
    z-index: -1;
  }
`

const AvatarBox = styled.div`
  padding: 1.5rem 2rem;
  border-top: 2px solid ${COLORS.dividerColor.prop};
`

const AvatarImageWrapper = styled.div`
  width: fit-content;
  clip-path: circle(50%);

  /* NextJS Image component sets inline-block on its wrapper, and it's otherwise impossible to change
  as of version 11.1.0 */
  & > * {
    display: block !important;
  }
`
