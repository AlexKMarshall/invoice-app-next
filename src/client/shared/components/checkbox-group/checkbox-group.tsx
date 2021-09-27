import * as styles from './checkbox-group.css'

import {
  AriaCheckboxGroupItemProps,
  AriaCheckboxGroupProps,
} from '@react-types/checkbox'
import {
  CheckboxGroupState,
  useCheckboxGroupState,
} from '@react-stately/checkbox'
import { ReactNode, createContext, useContext, useRef } from 'react'
import { useCheckboxGroup, useCheckboxGroupItem } from '@react-aria/checkbox'

import { Check } from 'src/client/shared/icons'
import { screenReaderOnly } from 'src/client/shared/styles/accessibility.css'

const CheckboxGroupContext = createContext<CheckboxGroupState | null>(null)

export function CheckboxGroup(
  props: withChildren<AriaCheckboxGroupProps>
): JSX.Element {
  const { children, label } = props
  const state = useCheckboxGroupState(props)
  const { groupProps, labelProps } = useCheckboxGroup(props, state)

  return (
    <div {...groupProps} className={styles.checkboxGroup}>
      {label ? <span {...labelProps}>{label}</span> : null}
      <CheckboxGroupContext.Provider value={state}>
        {children}
      </CheckboxGroupContext.Provider>
    </div>
  )
}

export function Checkbox(
  props: withChildren<AriaCheckboxGroupItemProps>
): JSX.Element {
  const { children } = props
  const state = useContext(CheckboxGroupContext)
  if (!state)
    throw new Error(
      'A <Checkbox> can only be used within a <CheckboxGroup> component'
    )

  const ref = useRef<HTMLInputElement>(null)
  const { inputProps } = useCheckboxGroupItem(props, state, ref)

  return (
    <label className={styles.checkboxWrapper}>
      <input {...inputProps} ref={ref} className={screenReaderOnly} />
      <div aria-hidden className={styles.checkbox}>
        <Check className={styles.checkmark} />
      </div>
      <span>{children}</span>
    </label>
  )
}

type withChildren<T> = T & { children: ReactNode }
