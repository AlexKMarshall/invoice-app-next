import { ForwardedRef, forwardRef } from 'react'
import {
  OptionHTMLAttributes,
  SelectHTMLAttributes,
} from 'hoist-non-react-statics/node_modules/@types/react'
import { labelWrapper, select, wrapper } from './select.css'

import { Stack } from 'src/client/shared/components'
import { useId } from '@react-aria/utils'

type Props = {
  label: string
  isLoading?: boolean
  options?: Array<Option>
  errorMessage?: string
} & SelectHTMLAttributes<HTMLSelectElement>

type Option = {
  value: string
  label?: string
  optionProps?: OptionHTMLAttributes<HTMLOptionElement>
}

const loadingOption = {
  value: '',
  label: 'Loading...',
  optionProps: { disabled: true },
}
const emptyOption = {
  value: '',
  label: '',
  optionProps: { disabled: true },
}

export const Select = forwardRef(function Select(
  {
    label,
    isLoading = false,
    options: optionsProp = [],
    errorMessage,
    className,
    defaultValue = '',
    ...delegatedProps
  }: Props,
  ref: ForwardedRef<HTMLSelectElement>
): JSX.Element {
  const options = isLoading ? [loadingOption] : [emptyOption, ...optionsProp]
  const controlId = useId()
  const errorId = useId()

  const status = errorMessage ? 'error' : 'valid'

  const wrapperClassName = wrapper({
    status,
  })

  return (
    <Stack size="-2" className={`${wrapperClassName} ${className}`}>
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
        defaultValue={defaultValue}
        {...delegatedProps}
        aria-invalid={status === 'error'}
        aria-describedby={status === 'error' ? errorId : undefined}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            {...option.optionProps}
          >
            {option.label ?? option.value}
          </option>
        ))}
      </select>
    </Stack>
  )
})
