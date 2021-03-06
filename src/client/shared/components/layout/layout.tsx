import {
  avatarBox,
  avatarImageWrapper,
  layoutWrapper,
  logo,
  logoBox,
  mainWrapper,
  sidebarWrapper,
} from './layout.css'

import Image from 'next/image'
import { Logo } from 'src/client/shared/icons'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function Layout({ children }: Props): JSX.Element {
  return (
    <div className={layoutWrapper}>
      <div className={mainWrapper}>{children}</div>
      <Sidebar />
    </div>
  )
}

function Sidebar(): JSX.Element {
  return (
    <aside className={sidebarWrapper}>
      <div className={logoBox}>
        <Logo className={logo} />
      </div>
      <div className={avatarBox}>
        <div className={avatarImageWrapper}>
          <Image
            src="/image-avatar.jpg"
            alt="man in a black rollneck shirt and orange beanie"
            height={40}
            width={40}
          />
        </div>
      </div>
    </aside>
  )
}
