import * as styles from './button.css'

import { ButtonHTMLAttributes } from 'react'
import { Except } from 'type-fest'
import { Plus } from 'src/client/shared/icons'
import { assignInlineVars } from '@vanilla-extract/dynamic'

type Icon = 'plus'

type Props = {
  color?: 'primary' | 'muted' | 'mono' | 'warning'
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
        [styles.prefixContent]: `'${prefix}`,
      })
    : undefined

  return (
    <button
      type="button"
      {...props}
      className={`${styles.button({ color, kind })} ${className}`}
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
    <div className={styles.iconWrapper}>
      <SvgComponent className={styles.iconSvg} />
    </div>
  )
}
