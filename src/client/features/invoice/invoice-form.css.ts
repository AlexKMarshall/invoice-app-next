import { createVar, style } from '@vanilla-extract/css'

import { calc } from '@vanilla-extract/css-utils'
import { themeVars } from 'src/client/shared/styles/theme.css'

export const form = style({
  maxWidth: '730px',
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
})

export const fieldset = style({
  border: 'none',
  margin: 0,
  padding: 0,
})

export const fieldsetHeader = style({
  margin: 0,
  padding: 0,
  color: themeVars.color.primary.main,
  fontWeight: themeVars.typography.fontWeight.bold,
})

export const itemListHeader = style({
  fontSize: `${17 / 16}rem`,
  fontWeight: themeVars.typography.fontWeight.bold,
  letterSpacing: '-0.375px',
  color: 'hsla(225, 14%, 53%, 1)',
})

export const gridWrapper = style({
  display: 'grid',
  gap: '24px',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gridAutoRows: 'auto',
})

export const spanHalf = style({
  gridColumn: 'span 3',
})
export const spanThird = style({
  gridColumn: 'span 2',
})
export const spanFull = style({
  gridColumn: 'span 6',
})

const spacing = createVar()

export const table = style([
  {
    tableLayout: 'fixed',
    borderSpacing: spacing,
    margin: calc.negate(spacing),

    vars: {
      [spacing]: '1rem',
    },
  },
  spanFull,
])

export const th = style({
  textAlign: 'left',
})

export const tableInput = style({
  padding: '16px 20px',
  border: `1px solid ${themeVars.color.fieldBoder}`,
  borderRadius: '4px',
  fontWeight: themeVars.typography.fontWeight.bold,
  width: '100%',
})

export const buttonGroup = style([
  {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  spanFull,
])

export const marginLeftAuto = style({
  marginLeft: 'auto',
})

export const deleteButton = style({
  color: themeVars.color.muted.hover,

  selectors: {
    '&:hover, &:focus': {
      color: themeVars.color.warning.main,
    },
  },
})

export const deleteIcon = style({
  height: '16px',
})
