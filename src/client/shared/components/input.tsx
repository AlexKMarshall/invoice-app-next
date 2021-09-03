import { COLORS, TYPOGRAPHY } from '../styles/theme'
import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react'

import styled from 'styled-components'
import { useId } from '@react-aria/utils'

type Props = {
  label: string
  clasName?: string
  errorMessage?: string
} & InputHTMLAttributes<HTMLInputElement>

const errorStyles = {
  '--text-color': COLORS.warningColor.prop,
  '--border-color': COLORS.warningColor.prop,
  '--outline-color': COLORS.warningColor.prop,
}

export const Input = forwardRef(function Input(
  { label, className, errorMessage, ...props }: Props,
  ref: ForwardedRef<HTMLInputElement>
): JSX.Element {
  const inputId = useId()
  const errorId = useId()

  const isInvalid = !!errorMessage

  const styles = isInvalid ? errorStyles : {}

  return (
    <Wrapper className={className} style={styles}>
      <LabelWrapper>
        <label htmlFor={inputId}>{label}</label>
        {isInvalid ? <div id={errorId}>{errorMessage}</div> : null}
      </LabelWrapper>
      <InputField
        id={inputId}
        ref={ref}
        type="text"
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? errorId : undefined}
        {...props}
      />
    </Wrapper>
  )
})

const Wrapper = styled.div`
  --text-color: ${COLORS.textColor.prop};
  --border-color: ${COLORS.fieldBorderColor.prop};
  --outline-color: ${COLORS.primaryColor.prop};

  color: var(--text-color);
  outline-color: var(--outline-color);
  border-color: var(--border-color);
  display: flex;
  flex-direction: column;
`

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const InputField = styled.input`
  margin-top: 10px;
  padding: 16px 20px;
  border: 1px solid;
  border-color: inherit;
  outline-color: inherit;
  color: inherit;
  border-radius: 4px;
  font-weight: ${TYPOGRAPHY.fontWeight.bold.prop};
`
