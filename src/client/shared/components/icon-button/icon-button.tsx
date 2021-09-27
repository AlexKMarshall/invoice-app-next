import { ButtonHTMLAttributes } from 'react'
import { iconButton } from './icon-button.css'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
}

export function IconButton({
  children,
  className,
  label,
  ...props
}: Props): JSX.Element {
  return (
    <button
      type="button"
      {...props}
      className={`${iconButton} ${className}`}
      aria-label={label}
    >
      {children}
    </button>
  )
}
