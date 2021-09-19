import {
  OverlayProps,
  useModal,
  useOverlay,
  usePreventScroll,
} from '@react-aria/overlays'
import { ReactNode, useRef } from 'react'
import { overlay, underlay } from './dialog.css'

import { AriaDialogProps } from '@react-types/dialog'
import { FocusScope } from '@react-aria/focus'
import { useDialog } from '@react-aria/dialog'

type Props = OverlayProps &
  AriaDialogProps & {
    title: string
    children: ReactNode
  }

export function Dialog(props: Props): JSX.Element {
  const { title, children } = props

  const ref = useRef<HTMLDivElement>(null)
  const { overlayProps, underlayProps } = useOverlay(props, ref)

  usePreventScroll()
  const { modalProps } = useModal()
  const { dialogProps, titleProps } = useDialog(props, ref)

  return (
    <div className={underlay} {...underlayProps}>
      <FocusScope contain restoreFocus autoFocus>
        <div
          {...overlayProps}
          {...dialogProps}
          {...modalProps}
          ref={ref}
          className={overlay}
        >
          <h2 {...titleProps}>{title}</h2>
          {children}
        </div>
      </FocusScope>
    </div>
  )
}
