import { button, iconSvg, iconWrapper, prefixContent } from './button.css'

import { ButtonHTMLAttributes } from 'react'
import { Except } from 'type-fest'
import { Plus } from '../icons/plus'
import { assignInlineVars } from '@vanilla-extract/dynamic'

type Icon = 'plus'

type Props = {
  color?: 'primary' | 'muted' | 'mono'
  icon?: Icon
  prefix?: string
} & Except<ButtonHTMLAttributes<HTMLButtonElement>, 'style'>

export function Button({
  color = 'primary',
  className,
  children,
  icon,
  prefix,
  ...props
}: Props): JSX.Element {
  let kind: 'icon' | 'prefix' | undefined

  // TODO - discriminating union?
  if (icon) kind = 'icon'
  if (prefix) kind = 'prefix'

  const additionalStyle = prefix
    ? assignInlineVars({
        [prefixContent]: `'${prefix}`,
      })
    : undefined

  return (
    <button
      {...props}
      className={`${button({ color, kind })} ${className}`}
      style={additionalStyle}
    >
      {icon ? <Icon icon={icon} /> : null}
      {children}
    </button>
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
    <div className={iconWrapper}>
      <SvgComponent className={iconSvg} />
    </div>
  )
}
