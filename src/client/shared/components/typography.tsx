import { BaseHTMLAttributes } from 'react'
import { heading } from 'src/client/features/invoice/typography.css'

type HeadingLevel = 1 | 2 | 3

const HEADING_LEVELS: Record<HeadingLevel, React.ElementType> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
}

type Props = {
  level?: keyof typeof HEADING_LEVELS
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
} & BaseHTMLAttributes<HTMLHeadingElement>

export function Heading({
  level = 1,
  as,
  className,
  children,
  ...props
}: Props): JSX.Element {
  const Component = as ?? HEADING_LEVELS[level]
  return (
    <Component className={`${heading({ level })} ${className}`} {...props}>
      {children}
    </Component>
  )
}
