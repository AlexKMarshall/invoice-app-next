import { COLORS, TYPOGRAPHY } from '../styles/theme'
import styled, { CSSProperties } from 'styled-components'

import { ButtonHTMLAttributes } from 'react'
import { Except } from 'type-fest'
import { Plus } from '../icons/plus'

const COLOR_PROPS = {
  primary: {
    '--idle-background': `${COLORS.primaryColor.prop}`,
    '--hover-background': `${COLORS.primaryColor.light.prop}`,
    '--color': 'white',
  },
  muted: {
    '--idle-background': COLORS.mutedColor.prop,
    '--hover-background': COLORS.mutedColor.hover.prop,
    '--focus-outline-color': 'var(--hover-background)',
    '--color': COLORS.textColor.prop,
  },
  mono: {
    '--idle-background': COLORS.monoColor.prop,
    '--hover-background': COLORS.monoColor.hover.prop,
    '--color': COLORS.monoColor.text.prop,
  },
}

type Icon = 'plus'

type Props = {
  color?: 'primary' | 'muted' | 'mono'
  icon?: Icon
  prefix?: string
} & Except<ButtonHTMLAttributes<HTMLButtonElement>, 'style'>

export function Button({
  color = 'primary',
  icon,
  prefix,
  children,
  ...props
}: Props): JSX.Element {
  const style = COLOR_PROPS[color]

  let Component = ButtonBase

  // TODO see if this can be made into a distminating union so we can't have both icon and prefix
  if (icon !== undefined) Component = IconButton
  if (prefix !== undefined) {
    Component = PrefixButton
    Object.assign(style, { '--prefix-content': prefix })
  }

  return (
    <Component {...props} style={style as CSSProperties}>
      {icon && <Icon icon={icon} />}
      {children}
    </Component>
  )
}

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

const ButtonBase = styled.button`
  --horizontal-padding: 1.5rem;
  --vertical-padding: 1rem;
  position: relative;
  padding: var(--vertical-padding) var(--horizontal-padding);
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: 999px;
  --background-color: var(--idle-background);
  --focus-outline-color: var(--background-color);
  background-color: var(--background-color);
  color: var(--color);
  font-weight: ${TYPOGRAPHY.fontWeight.bold.prop};

  &:hover {
    --background-color: var(--hover-background);
  }

  &:focus-visible {
    border-color: white;

    box-shadow: 0 0 0 2px var(--focus-outline-color);
    outline: 1px solid transparent;
  }
`

const IconButton = styled(ButtonBase)`
  --icon-size: 32px;
  padding-left: calc(var(--horizontal-padding) + var(--icon-size));
`

const PrefixButton = styled(ButtonBase)`
  --prefix-content: '';
  &:before {
    content: var(--prefix-content);
    display: inline-block;
    margin-right: 0.5ch;
  }
`
