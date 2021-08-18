import { COLORS, TYPOGRAPHY } from '../styles/theme'

import { BaseHTMLAttributes } from 'react'
import styled from 'styled-components'

const LEVELS = {
  1: {
    component: 'h1' as const,
    style: {
      '--font-size': TYPOGRAPHY.h1.fontSize.prop,
      '--line-height': TYPOGRAPHY.h1.lineHeight.prop,
      '--letter-spacing': TYPOGRAPHY.h1.letterSpacing.prop,
    },
  },
  2: {
    component: 'h2' as const,
    style: {
      '--font-size': TYPOGRAPHY.h2.fontSize.prop,
      '--line-height': TYPOGRAPHY.h2.lineHeight.prop,
      '--letter-spacing': TYPOGRAPHY.h2.letterSpacing.prop,
    },
  },
  3: {
    component: 'h3' as const,
    style: {
      '--font-size': TYPOGRAPHY.h3.fontSize.prop,
      '--line-height': TYPOGRAPHY.h3.lineHeight.prop,
      '--letter-spacing': TYPOGRAPHY.h3.letterSpacing.prop,
    },
  },
}

type Props = {
  level?: keyof typeof LEVELS
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
} & BaseHTMLAttributes<HTMLHeadingElement>

export function Heading({
  level = 1,
  children,
  style,
  ...props
}: Props): JSX.Element {
  const levelOptions = LEVELS[level]
  return (
    <Wrapper
      as={levelOptions.component}
      style={{ ...style, ...levelOptions.style }}
      {...props}
    >
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.h1`
  font-weight: ${TYPOGRAPHY.fontWeight.bold.prop};
  font-size: var(--font-size);
  line-height: var(--line-height);
  letter-spacing: var(--letter-spacing);
  color: ${COLORS.textColor.strong.prop};
`
