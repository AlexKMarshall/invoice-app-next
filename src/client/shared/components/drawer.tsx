import { ReactNode, useContext, useMemo, useRef, useState } from 'react'

import { FocusScope } from '@react-aria/focus'
import ReactDOM from 'react-dom'
import { RefObject } from 'hoist-non-react-statics/node_modules/@types/react'
import { createContext } from 'react'
import styled from 'styled-components'
import { useDialog } from '@react-aria/dialog'
import { useId } from '@react-aria/utils'
import { useOverlay } from '@react-aria/overlays'

type Props = {
  children: ReactNode
}

export function Drawer(props: Props): JSX.Element {
  const { children } = props
  const { isOpen, close, titleId } = useDrawer()
  const overlayRef = useRef<HTMLDivElement>(null)

  const { overlayProps, underlayProps } = useOverlay(
    { isOpen, onClose: close, isDismissable: true },
    overlayRef
  )

  const { dialogProps } = useDialog({ 'aria-labelledby': titleId }, overlayRef)

  return isOpen ? (
    <DrawerPortal>
      <Underlay {...underlayProps}>
        <FocusScope contain autoFocus restoreFocus>
          <Overlay {...dialogProps} {...overlayProps}>
            {children}
          </Overlay>
        </FocusScope>
      </Underlay>
    </DrawerPortal>
  ) : (
    <></>
  )
}

function DrawerPortal({ children }: { children: ReactNode }) {
  const { drawerPortalRef } = useDrawer()

  if (!drawerPortalRef.current) return null

  return ReactDOM.createPortal(children, drawerPortalRef.current)
}

type DrawerContextValue = {
  drawerPortalRef: RefObject<HTMLDivElement>
  isOpen: boolean
  open: () => void
  close: () => void
  titleId: string
}
const DrawerContext = createContext<DrawerContextValue | undefined>(undefined)

type InitialBooleanState = boolean | (() => boolean)
function useBooleanState(initialState: InitialBooleanState = false) {
  const [state, setState] = useState(initialState)

  return useMemo(
    () => ({
      state,
      toggle: () => setState((s) => !s),
      setTrue: () => setState(true),
      setFalse: () => setState(false),
    }),
    [state]
  )
}

type DrawerProviderProps = {
  children: ReactNode
}
export function DrawerProvider({ children }: DrawerProviderProps): JSX.Element {
  const drawerPortalRef = useRef<HTMLDivElement>(null)
  const { state: isOpen, setTrue: open, setFalse: close } = useBooleanState()
  const titleId = useId()

  const value = useMemo(
    () => ({
      drawerPortalRef,
      isOpen,
      open,
      close,
      titleId,
    }),
    [close, isOpen, open, titleId]
  )

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  )
}

export function useDrawer(): DrawerContextValue {
  const context = useContext(DrawerContext)
  if (typeof context === 'undefined')
    throw new Error('useDrawer must be rendered inside a <DrawerProvider/>')
  return context
}

export function DrawerOverlayContainer({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const { isOpen } = useDrawer()

  return <div aria-hidden={isOpen}>{children}</div>
}

export function DrawerContainer(): JSX.Element {
  const { drawerPortalRef } = useDrawer()

  return <div ref={drawerPortalRef} />
}

const Underlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
`

// This uses the width of the sidebar to avoid getting hidden by it, could maybe measure that instead of hard coding
const Overlay = styled.div`
  max-width: 80vw;
  padding: 56px;
  padding-left: calc(104px + 56px);
  background-color: white;
  overflow-y: auto;
`
