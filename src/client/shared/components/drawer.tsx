import {
  OverlayProps,
  useModal,
  useOverlay,
  usePreventScroll,
} from '@react-aria/overlays'
import { ReactNode, useContext, useRef } from 'react'

import { AriaDialogProps } from '@react-types/dialog'
import { FocusScope } from '@react-aria/focus'
import { RefObject } from 'hoist-non-react-statics/node_modules/@types/react'
import { createContext } from 'react'
import { useDialog } from '@react-aria/dialog'

type Props = {
  title: string
  children: ReactNode
} & OverlayProps &
  AriaDialogProps

export function Drawer(props: Props): JSX.Element {
  const { title, children } = props
  const ref = useRef<HTMLDivElement>(null)
  const { overlayProps, underlayProps } = useOverlay(props, ref)

  usePreventScroll()
  const { modalProps } = useModal()

  const { dialogProps, titleProps } = useDialog(props, ref)

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: 'hsla(0deg, 0%, 0%, 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...underlayProps}
    >
      <FocusScope contain restoreFocus autoFocus>
        <div
          {...overlayProps}
          {...dialogProps}
          {...modalProps}
          ref={ref}
          style={{
            background: 'white',
            color: 'black',
            padding: 30,
          }}
        >
          <h3 {...titleProps} style={{ marginTop: 0 }}>
            {title}
          </h3>
          {children}
        </div>
      </FocusScope>
    </div>
  )
}

type DrawerContextValue = {
  drawerRef: RefObject<HTMLDivElement>
}
const DrawerContext = createContext<DrawerContextValue | undefined>(undefined)

type DrawerProviderProps = {
  children: ReactNode
}
export function DrawerProvider({ children }: DrawerProviderProps): JSX.Element {
  const drawerRef = useRef<HTMLDivElement>(null)

  return (
    <DrawerContext.Provider value={{ drawerRef }}>
      {children}
    </DrawerContext.Provider>
  )
}

export function useDrawer(): DrawerContextValue {
  const context = useContext(DrawerContext)
  if (typeof context === 'undefined')
    throw new Error('useDrawer must be rendered inside a <DrawerProvider/>')
  return context
}
