import {
  DismissButton,
  OverlayContainer,
  OverlayProps,
  useModal,
  useOverlay,
  useOverlayPosition,
  useOverlayTrigger,
} from '@react-aria/overlays'
import React, { ReactNode, RefObject, useRef } from 'react'
import { downChevron, filterButton, popover } from './filter.css'
import { mergeProps, useId } from '@react-aria/utils'

import { AriaLabelingProps } from '@react-types/shared'
import { ArrowDown } from '../../icons/arrow-down'
import { FocusScope } from '@react-aria/focus'
import { useButton } from '@react-aria/button'
import { useDialog } from '@react-aria/dialog'
import { useOverlayTriggerState } from '@react-stately/overlays'

type Props = OverlayProps &
  AriaLabelingProps & {
    overlayRef: RefObject<HTMLDivElement>
    children: ReactNode
  }

function Popover({
  overlayRef,
  onClose,
  isOpen,
  children,
  ...otherProps
}: Props) {
  const { overlayProps } = useOverlay(
    { onClose, isOpen, isDismissable: true },
    overlayRef
  )

  const { modalProps } = useModal()

  const { dialogProps } = useDialog(otherProps, overlayRef)

  return (
    <FocusScope restoreFocus autoFocus>
      <div
        {...mergeProps(overlayProps, dialogProps, otherProps, modalProps)}
        className={popover}
        ref={overlayRef}
      >
        {children}
        <DismissButton onDismiss={onClose} />
      </div>
    </FocusScope>
  )
}

type FilterProps = {
  label: string
  id?: string
  className?: string
  children: ReactNode
}
export function Filter({
  label,
  children,
  id,
  className,
}: FilterProps): JSX.Element {
  const state = useOverlayTriggerState({})

  const triggerRef = useRef(null)
  const overlayRef = useRef(null)

  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'menu' },
    state,
    triggerRef
  )

  const { overlayProps: positionProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    placement: 'bottom',
    offset: 5,
    isOpen: state.isOpen,
  })

  let buttonId = useId()
  buttonId = id ?? buttonId

  const { buttonProps } = useButton(
    { id: buttonId, onPress: () => state.open() },
    triggerRef
  )

  return (
    <>
      <button
        {...buttonProps}
        {...triggerProps}
        ref={triggerRef}
        className={`${filterButton} ${className}`}
      >
        {label}
        <ArrowDown className={downChevron} aria-hidden />
      </button>
      {state.isOpen && (
        <OverlayContainer>
          <Popover
            {...overlayProps}
            {...positionProps}
            overlayRef={overlayRef}
            isOpen={state.isOpen}
            onClose={state.close}
            aria-labelledby={buttonId}
          >
            {children}
          </Popover>
        </OverlayContainer>
      )}
    </>
  )
}
