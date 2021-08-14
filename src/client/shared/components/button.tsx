import { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

type Props = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, ...props }: Props): JSX.Element {
  return <Wrapper {...props}>{children}</Wrapper>
}

const Wrapper = styled.button`
  --background-color: hsla(252deg, 94%, 67%, 100%);
  --background-hover: hsla(252deg, 100%, 73%);
  padding: 1rem 1.5rem;
  border: 2px solid transparent;
  border-radius: 999px;
  background-color: var(--background-color);
  color: white;
  font-weight: 700;

  &:hover {
    background-color: var(--background-hover);
  }

  &:focus-visible {
    border-color: white;
    box-shadow: 0 0 0 2px var(--background-color);
    outline: 1px solid transparent;
  }
`
