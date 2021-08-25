import { COLORS, TYPOGRAPHY } from '../styles/theme'
import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react'

import styled from 'styled-components'

type Props = {
  label: string
  clasName?: string
} & InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef(function Input(
  { label, className, ...props }: Props,
  ref: ForwardedRef<HTMLInputElement>
): JSX.Element {
  return (
    <Label className={className}>
      {label}
      <InputField ref={ref} type="text" {...props} />
    </Label>
  )
})

const Label = styled.label`
  display: flex;
  flex-direction: column;
`

const InputField = styled.input`
  margin-top: 10px;
  padding: 16px 20px;
  border: 1px solid ${COLORS.fieldBorderColor.prop};
  border-radius: 4px;
  font-weight: ${TYPOGRAPHY.fontWeight.bold.prop};
`
