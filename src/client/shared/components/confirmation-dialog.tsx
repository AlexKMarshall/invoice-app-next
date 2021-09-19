import {
  OverlayContainer,
  OverlayProps,
  OverlayProvider,
  useModal,
  useOverlay,
  usePreventScroll,
} from '@react-aria/overlays'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import {
  actionButtons,
  heading,
  overlay,
  underlay,
} from './confirmation-dialog.css'

import { AriaDialogProps } from '@react-types/dialog'
import { Button } from './button'
import { FocusScope } from '@react-aria/focus'
import { useDialog } from '@react-aria/dialog'

type ConfirmationMeta = {
  title: string
  message?: string
  actionLabel?: string
  onConfirm?: () => void
}

const confirmationMetaDefaults = {
  message: 'Are you sure?',
  actionLabel: 'OK',
}

type ConfirmationDialogContext = {
  openDialog: (meta: ConfirmationMeta) => void
}
const ConfirmationDialogContext =
  createContext<ConfirmationDialogContext | null>(null)

export function useConfirmationDialog(): ConfirmationDialogContext {
  const context = useContext(ConfirmationDialogContext)
  if (!context)
    throw new Error(
      'useConfirmationDialog must be used within a <ConfirmationDialogProvider>'
    )
  return context
}

type ProviderProps = {
  children: ReactNode
}

type OpenDialog = {
  type: 'OPEN'
  meta: ConfirmationMeta
}
type CloseDialog = {
  type: 'CLOSE'
}

type ConfirmationAction = OpenDialog | CloseDialog

type ConfirmationDialogState =
  | {
      state: 'open'
      meta: ConfirmationMeta
    }
  | { state: 'closed' }

function dialogReducer(
  state: ConfirmationDialogState,
  action: ConfirmationAction
): ConfirmationDialogState {
  switch (action.type) {
    case 'CLOSE':
      return { state: 'closed' }
    case 'OPEN':
      return {
        state: 'open',
        meta: { ...confirmationMetaDefaults, ...action.meta },
      }
  }
}

const initialDialogState: ConfirmationDialogState = { state: 'closed' }

export function ConfirmationDialogProvider({
  children,
}: ProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(dialogReducer, initialDialogState)

  const value = useMemo(
    () => ({
      openDialog: (meta: ConfirmationMeta) => dispatch({ type: 'OPEN', meta }),
      closeDialog: () => dispatch({ type: 'CLOSE' }),
    }),
    []
  )

  const { closeDialog } = value

  const handleConfirm = useCallback(() => {
    if ('meta' in state) {
      state.meta.onConfirm?.()
    }
    closeDialog()
  }, [closeDialog, state])

  return (
    <ConfirmationDialogContext.Provider value={value}>
      <OverlayProvider>
        {children}
        {state.state === 'open' ? (
          <OverlayContainer>
            <ConfirmationDialog
              title={state.meta.title}
              message={state.meta.message}
              isOpen={true}
              onClose={closeDialog}
              isDismissable
              actionLabel={state.meta.actionLabel}
              onConfirm={handleConfirm}
            />
          </OverlayContainer>
        ) : null}
      </OverlayProvider>
    </ConfirmationDialogContext.Provider>
  )
}

type Props = OverlayProps &
  AriaDialogProps & {
    title: string
    message?: string
    actionLabel?: string
    onConfirm?: () => void
  }

export function ConfirmationDialog(props: Props): JSX.Element {
  const { title, message, onConfirm, actionLabel = 'OK' } = props

  const ref = useRef<HTMLDivElement>(null)
  const { overlayProps, underlayProps } = useOverlay(props, ref)

  usePreventScroll()
  const { modalProps } = useModal()
  const { dialogProps, titleProps } = useDialog(props, ref)

  const handleConfirm = useCallback(() => {
    onConfirm?.()
  }, [onConfirm])

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
          <h2 {...titleProps} className={heading}>
            {title}
          </h2>
          {message ? <p>{message}</p> : null}
          <div className={actionButtons}>
            <Button color="muted" onClick={props.onClose}>
              Cancel
            </Button>
            <Button color="warning" onClick={handleConfirm}>
              {actionLabel}
            </Button>
          </div>
        </div>
      </FocusScope>
    </div>
  )
}
