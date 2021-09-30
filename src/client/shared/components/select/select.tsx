import { ForwardedRef, forwardRef } from 'react'
import { labelWrapper, select, wrapper } from './select.css'

import { useId } from '@react-aria/utils'

type Props = {
  label: string
  isLoading?: boolean
  options?: Array<{ value: string; label?: string }>
  errorMessage?: string
}

const loadingOption = { value: '', label: 'Loading...' }

export const Select = forwardRef(function Select(
  { label, isLoading = false, options: optionsProp = [], errorMessage }: Props,
  ref: ForwardedRef<HTMLSelectElement>
): JSX.Element {
  const options = isLoading ? [loadingOption] : optionsProp
  const controlId = useId()
  const errorId = useId()

  const status = errorMessage ? 'error' : 'valid'

  const wrapperClassName = wrapper({
    status,
  })

  return (
    <div className={`${wrapperClassName}`}>
      <div className={labelWrapper}>
        <label htmlFor={controlId}>{label}</label>

        <div id={errorId} role="alert">
          {errorMessage}
        </div>
      </div>
      <select
        className={select}
        id={controlId}
        ref={ref}
        aria-invalid={status === 'error'}
        aria-describedby={status === 'error' ? errorId : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label ?? option.value}
          </option>
        ))}
      </select>
    </div>
  )
})
