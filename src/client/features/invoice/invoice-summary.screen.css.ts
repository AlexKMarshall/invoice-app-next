import { createVar, globalStyle, style } from '@vanilla-extract/css'

import { calc } from '@vanilla-extract/css-utils'
import { recipe } from '@vanilla-extract/recipes'
import { themeVars } from 'src/client/shared/styles/theme.css'

export const main = style({
  paddingBlock: themeVars.layout.size[7],
  minHeight: '99vh', // 100vh is giving extra scrollbar
})

export const header = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: themeVars.layout.size[2],
})

globalStyle(`${header} > :first-child`, {
  marginRight: 'auto',
})

export const emptyStateWrapper = style({
  width: '100%',
  display: 'grid',
  gridTemplateAreas: '"content"',
  placeItems: 'center',
  textAlign: 'center',
  flexGrow: 1,
})

globalStyle(`${emptyStateWrapper} > *`, {
  gridArea: 'content',
})

export const emptyState = style({
  maxWidth: 'min-content',
})

export const emptyStateHeader = style({
  whiteSpace: 'nowrap',
})

export const drawerTitle = style({
  fontSize: `${24 / 16}rem`,
  fontWeight: themeVars.typography.fontWeight.bold,
  lineHeight: `${32 / 16}rem`,
  letterSpacing: '-0.5px',
  color: themeVars.color.text.strong,
})

const tableSpacing = createVar()

export const table = style({
  width: '100%',
  borderSpacing: `0 ${tableSpacing}`,
  marginTop: calc.negate(tableSpacing),

  vars: {
    [tableSpacing]: themeVars.layout.size[0],
  },
})

const cursor = createVar()
const borderRadius = createVar()
const borderColor = createVar()
const borderWidth = createVar()
const borderStyle = createVar()
const border = createVar()
const tablePaddingInline = createVar()
const cellPaddingBlock = createVar()
const cellPaddingInline = createVar()

// this uses fluid width calculator theory https://courses.joshwcomeau.com/css-for-js/05-responsive-css/16-fluid-calculator
// it should give the small size at around 750px screen width and the large size around 950px
// this helps to gracefully shrink the cell padding as space gets smaller, reducing cell wrapping
const responsiveCellInlinePadding = `clamp(${
  themeVars.layout.size[-3]
}, 6vw - 2.5rem, ${themeVars.layout.size[1]})`

export const rowWrapper = recipe({
  base: {
    position: 'relative',
    boxShadow: `0 10px 10px -10px ${themeVars.color.shadow}`,
    cursor,

    vars: {
      [cursor]: 'pointer',
      [borderRadius]: themeVars.layout.borderRadius.l,
      [borderColor]: 'transparent',
      [borderWidth]: '2px',
      [borderStyle]: 'solid',
      [border]: `${borderWidth} ${borderStyle} ${borderColor}`,
      [cellPaddingBlock]: themeVars.layout.size[0],
      [tablePaddingInline]: themeVars.layout.size[3],
      [cellPaddingInline]: responsiveCellInlinePadding,
    },

    selectors: {
      '&:hover, &:focus-within': {
        vars: {
          [borderColor]: themeVars.color.primary.main,
        },
      },
    },
  },

  variants: {
    saving: {
      true: {
        vars: {
          [cursor]: 'default',
        },
        ':hover': {
          vars: {
            [borderColor]: 'transparent',
          },
        },
        ':focus': {
          vars: {
            [borderColor]: 'transparent',
          },
        },
      },
    },
  },
})

export const rowLink = style({
  ':focus': {
    outline: 'none',
  },
})

export const cell = style({
  backgroundColor: 'white',
  paddingBlock: cellPaddingBlock,
  borderTop: border,
  borderBottom: border,
  paddingInline: cellPaddingInline,

  ':first-child': {
    paddingLeft: tablePaddingInline,
    borderLeft: border,
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
  },

  ':last-child': {
    paddingRight: themeVars.layout.size[5],
    borderRight: border,
    borderTopRightRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
  },
})

export const iconWrapper = style({
  position: 'absolute',
  right: themeVars.layout.size[2],
  top: '50%',
  transform: 'translateY(-50%)',
  color: themeVars.color.primary.main,
})

export const iconSvg = style({
  display: 'block',
  width: '7px',
  height: '10px',
})

export const invoiceId = style({
  color: themeVars.color.text.strong,
  fontWeight: themeVars.typography.fontWeight.bold,
  textDecoration: 'none',
  textTransform: 'uppercase',

  ':before': {
    content: `'#'`,
    color: themeVars.color.text.normal,
  },
})
