import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react'
import { input, inputWrapper, labelWrapper } from './input.css'

import { useId } from '@react-aria/utils'

type Props = {
  label: string
  clasName?: string
  errorMessage?: string
} & InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef(function Input(
  { label, className, errorMessage, disabled, ...props }: Props,
  ref: ForwardedRef<HTMLInputElement>
): JSX.Element {
  const inputId = useId()
  const errorId = useId()

  const status = errorMessage ? 'error' : 'valid'

  const inputWrapperClassName = inputWrapper({
    status,
    disabled: disabled || undefined,
  })

  return (
    <div className={`${inputWrapperClassName} ${className}`}>
      <div className={labelWrapper}>
        <label htmlFor={inputId}>{label}</label>

        <div id={errorId} role="alert">
          {errorMessage}
        </div>
      </div>
      <input
        className={input}
        id={inputId}
        ref={ref}
        type="text"
        aria-invalid={status === 'error'}
        aria-describedby={status === 'error' ? errorId : undefined}
        disabled={disabled}
        {...props}
      />
    </div>
  )
})
