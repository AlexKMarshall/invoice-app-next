import { COLORS, TYPOGRAPHY } from '../styles/theme'

import { ButtonHTMLAttributes } from 'react'
import { Plus } from '../icons/plus'
import styled from 'styled-components'

type Icon = 'plus'

type Props = {
  variant?: 'primary' | 'muted' | 'mono'
  icon?: Icon
  prefix?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant = 'primary',
  icon,
  prefix,
  children,
  style,
  ...props
}: Props): JSX.Element {
  const extraStyles = {}
  if (icon !== undefined) Object.assign(extraStyles, { '--icon-size': '32px' })
  if (prefix !== undefined)
    Object.assign(extraStyles, {
      '--prefix-content': `'${prefix}'`,
      '--prefix-margin': '0.5ch',
    })
  if (variant === 'muted')
    Object.assign(extraStyles, {
      '--idle-background': COLORS.mutedColor.prop,
      '--hover-background': COLORS.mutedColor.hover.prop,
      '--color': COLORS.textColor.prop,
    })
  if (variant === 'mono')
    Object.assign(extraStyles, {
      '--idle-background': COLORS.monoColor.prop,
      '--hover-background': COLORS.monoColor.hover.prop,
      '--color': COLORS.monoColor.text.prop,
    })

  return (
    <Wrapper {...props} style={{ ...style, ...extraStyles }}>
      {icon && <Icon icon={icon} />}
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.button`
  --idle-background: ${COLORS.primaryColor.prop};
  --hover-background: ${COLORS.primaryColor.light.prop};
  --background-color: var(--idle-background);
  --color: white;
  --icon-size: 0px;
  --prefix-content: '';
  --prefix-margin: 0;
  position: relative;
  padding: 1rem 1.5rem 1rem calc(1.5rem + var(--icon-size));
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: 999px;
  background-color: var(--background-color);
  color: var(--color);
  font-weight: ${TYPOGRAPHY.fontWeight.bold.prop};

  &:hover {
    --background-color: var(--hover-background);
  }

  &:focus-visible {
    border-color: white;

    box-shadow: 0 0 0 2px var(--background-color);
    outline: 1px solid transparent;
  }

  &:before {
    content: var(--prefix-content);
    display: inline-block;
    margin-right: var(--prefix-margin);
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
