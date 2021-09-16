import { createVar, globalStyle, style } from '@vanilla-extract/css'

import { calc } from '@vanilla-extract/css-utils'
import { recipe } from '@vanilla-extract/recipes'
import { themeVars } from 'src/client/shared/styles/theme.css'

export const header = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingTop: '72px',
  paddingBottom: '65px',
})

globalStyle(`${header} > :first-child`, {
  marginRight: 'auto',
})

export const heading = style({
  marginBottom: '8px',
})

export const emptyStateWrapper = style({
  marginLeft: 'auto',
  marginRight: 'auto',
  maxWidth: 'min-content',
  textAlign: 'center',
  paddingTop: '48px',
})

globalStyle(`${emptyStateWrapper} > :nth-child(2)`, {
  marginTop: '64px',
  marginBottom: '24px',
  whiteSpace: 'nowrap',
})

export const drawerTitle = style({
  marginBottom: '48px',
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
    [tableSpacing]: '1rem',
  },
})

const cursor = createVar()
const borderRadius = createVar()
const borderColor = createVar()
const borderWidth = createVar()
const borderStyle = createVar()
const border = createVar()

export const rowWrapper = recipe({
  base: {
    position: 'relative',
    boxShadow: `0 10px 10px -10px ${themeVars.color.shadow}`,
    cursor,

    vars: {
      [cursor]: 'pointer',
      [borderRadius]: '8px',
      [borderColor]: 'transparent',
      [borderWidth]: '2px',
      [borderStyle]: 'solid',
      [border]: `${borderWidth} ${borderStyle} ${borderColor}`,
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
  paddingTop: '1rem',
  paddingBottom: '1rem',
  borderTop: border,
  borderBottom: border,
  paddingLeft: '1.25rem',
  paddingRight: '1.25rem',

  ':first-child': {
    paddingLeft: '2rem',
    borderLeft: border,
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
  },

  ':last-child': {
    paddingRight: '3rem',
    borderRight: border,
    borderTopRightRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
  },
})

export const iconWrapper = style({
  position: 'absolute',
  right: '24px',
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

  ':before': {
    content: `'#'`,
    color: themeVars.color.text.normal,
  },
})
