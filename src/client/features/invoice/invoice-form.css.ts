import { createVar, style } from '@vanilla-extract/css'

import { calc } from '@vanilla-extract/css-utils'
import { recipe } from '@vanilla-extract/recipes'
import { themeVars } from 'src/client/shared/styles/theme.css'

export const form = style({
  maxWidth: themeVars.layout.measure,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
})

export const scrollArea = style({
  overflowY: 'auto',
  padding: themeVars.layout.size[6],
  paddingBlockEnd: themeVars.layout.size[0],
  position: 'relative',
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
    backgroundColor: 'white',
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: themeVars.layout.size[-3],
    paddingBlock: themeVars.layout.size[3],
    paddingInline: themeVars.layout.size[6],
    borderTopRightRadius: themeVars.layout.borderRadius.xl,
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

const shadowGradient = createVar()

const scrollShadow = style({
  position: 'absolute',
  left: '-50px',
  right: '0',
  height: '25%',
  pointerEvents: 'none',
  transition: 'opacity 200ms ease-in-out',

  vars: {
    [shadowGradient]: 'rgba(0,0,0,0.1), rgba(0,0,0,0)',
  },
})

export const topShadow = recipe({
  base: [
    scrollShadow,
    {
      top: '0',
      backgroundImage: `linear-gradient(to bottom, ${shadowGradient})`,
    },
  ],

  variants: {
    visibility: {
      visible: {
        opacity: '1',
      },
      invisible: {
        opacity: '0',
      },
    },
  },
})

export const bottomShadow = recipe({
  base: [
    scrollShadow,
    {
      bottom: '40px',
      backgroundImage: `linear-gradient(to top, ${shadowGradient})`,
    },
  ],

  variants: {
    visibility: {
      visible: {
        opacity: '1',
      },
      invisible: {
        opacity: '0',
      },
    },
  },
})
