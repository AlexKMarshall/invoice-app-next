import { calc } from '@vanilla-extract/css-utils'
import { style } from '@vanilla-extract/css'
import { themeVars } from 'src/client/shared/styles/theme.css'

export const form = style({
  maxWidth: themeVars.layout.measure,
  height: '100%',
  display: 'flex',
})

export const scrollArea = style({
  overflowY: 'auto',
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
  gap: themeVars.layout.size[2],
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

export const tableWrapper = style([
  {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  spanFull,
])

export const table = style([
  {
    tableLayout: 'fixed',
    borderSpacing: themeVars.layout.size[0],
    margin: calc.negate(themeVars.layout.size[0]),
  },
])

export const th = style({
  textAlign: 'left',
})

export const tableInput = style({
  paddingBlock: themeVars.layout.size[0],
  paddingInline: themeVars.layout.size[1],
  border: `1px solid ${themeVars.color.fieldBoder}`,
  borderRadius: themeVars.layout.borderRadius.s,
  fontWeight: themeVars.typography.fontWeight.bold,
  width: '100%',
})

export const itemTotal = style({
  textAlign: 'right',
  fontWeight: themeVars.typography.fontWeight.bold,
})

export const buttonGroup = style([
  {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: themeVars.layout.size[-3],
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
