import { ButtonHTMLAttributes } from 'react'
import { Plus } from '../icons/plus'
import styled from 'styled-components'

type Icon = 'plus'

type Props = {
  icon?: Icon
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  icon,
  children,
  style,
  ...props
}: Props): JSX.Element {
  const extraStyles = icon ? { '--icon-size': '32px' } : {}
  return (
    <Wrapper {...props} style={{ ...style, ...extraStyles }}>
      {icon && <Icon icon={icon} />}
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.button`
  --idle-background: hsla(252deg, 94%, 67%, 100%);
  --hover-background: hsla(252deg, 100%, 73%);
  --background-color: var(--idle-background);
  --icon-size: 0px;
  position: relative;
  padding: 1rem 1.5rem 1rem calc(1.5rem + var(--icon-size));
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: 999px;
  background-color: var(--background-color);
  color: white;
  font-weight: 700;

  &:hover {
    --background-color: var(--hover-background);
  }

  &:focus-visible {
    border-color: white;

    box-shadow: 0 0 0 2px var(--background-color);
    outline: 1px solid transparent;
  }
`

const ICON_SVGS = {
  plus: Plus,
}

type IconProps = {
  icon: Icon
}
function Icon({ icon }: IconProps) {
  const SvgComponent = ICON_SVGS[icon]
  return (
    <IconWrapper>
      <SvgComponent />
    </IconWrapper>
  )
}

const IconWrapper = styled.div`
  --icon-color: var(--background-color);
  width: var(--icon-size);
  height: var(--icon-size);
  background-color: white;
  color: var(--icon-color);
  position: absolute;
  border-radius: 50%;
  top: 8px;
  left: 8px;
  display: grid;
  place-items: center;

  & > * {
    width: 10px;
    height: 10px;
  }
`
