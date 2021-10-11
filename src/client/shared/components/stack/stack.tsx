import { sizeVariants, stack } from './stack.css'

import { forwardRef } from 'react'

type DivProps = {
  component?: 'div'
} & React.ComponentPropsWithoutRef<'div'>

type MainProps = {
  component?: 'main'
} & React.ComponentPropsWithoutRef<'main'>

type SectionProps = {
  component?: 'section'
} & React.ComponentPropsWithoutRef<'section'>

type ComponentProps = DivProps | MainProps | SectionProps

type BaseProps = {
  size?: keyof typeof sizeVariants
}
type Props = BaseProps & ComponentProps

export const Stack = forwardRef(function Stack(
  { component = 'div', children, className, size = '0', ...props }: Props,
  ref: any
): JSX.Element {
  const Component = component
  return (
    <Component
      className={`${stack({ size })} ${className}`}
      {...props}
      ref={ref}
    >
      {children}
    </Component>
  )
})
