import { recipe } from '@vanilla-extract/recipes'
import { style } from '@vanilla-extract/css'
import { themeVars } from 'src/client/shared/styles/theme.css'

export const statusBar = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'baseline',
  gap: '8px',
  padding: '20px 32px',
  marginBottom: '24px',
  backgroundColor: 'white',
  borderRadius: themeVars.layout.borderRadius.l,
  boxShadow: `0 10px 10px -10px ${themeVars.color.shadow}`,
})

export const status = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '16px',
  marginRight: 'auto',
})

export const details = style({
  padding: '48px',
  backgroundColor: 'white',
  borderRadius: themeVars.layout.borderRadius.l,
  boxShadow: `0 10px 10px -10px ${themeVars.color.shadow}`,
})

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '21px',
  marginBottom: '45px',
})

export const twoColumns = style({
  gridColumn: 'span 2',
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

export const addressWrapper = recipe({
  base: {
    fontSize: themeVars.typography.body2.fontSize,
    lineHeight: themeVars.typography.body2.lineHeight,
    letterSpacing: themeVars.typography.body2.letterSpacing,
  },

  variants: {
    align: {
      left: {
        textAlign: 'left',
      },
      right: {
        textAlign: 'right',
      },
    },
  },

  defaultVariants: {
    align: 'left',
  },
})

export const sectionHeader = style({
  fontSize: themeVars.typography.body1.fontSize,
  letterSpacing: themeVars.typography.body1.letterSpacing,
  fontWeight: themeVars.typography.fontWeight.normal,
  marginBottom: '12px',
})

export const primaryValue = style({
  fontSize: '15px',
  lineHeight: '20px',
  letterSpacing: '-0.31px',
  color: themeVars.color.text.strong,
  fontWeight: themeVars.typography.fontWeight.bold,
})

export const itemTable = style({
  tableLayout: 'fixed',
  width: '100%',
  padding: '32px',
  borderCollapse: 'collapse',
  borderRadius: themeVars.layout.borderRadius.l,
  overflow: 'hidden',
})

export const thead = style({
  backgroundColor: 'hsla(231, 67%, 99%, 1)',
  fontSize: themeVars.typography.body2.fontSize,
  lineHeight: themeVars.typography.body2.lineHeight,
  letterSpacing: themeVars.typography.body2.letterSpacing,
  fontWeight: themeVars.typography.fontWeight.normal,
})

export const headingCell = style({
  paddingTop: '32px',
  paddingBottom: '32px',
  fontWeight: 'inherit',
  boxSizing: 'content-box',

  selectors: {
    '&:nth-child(1)': {
      paddingLeft: '32px',
      width: '50%',
      textAlign: 'left',
    },
    '&:nth-child(2)': {
      width: '10%',
      textAlign: 'center',
    },
    '&:nth-child(3)': {
      width: '20%',
      textAlign: 'right',
    },
    '&:nth-child(4)': {
      paddingRight: '32px',
      width: '20%',
      textAlign: 'right',
    },
  },
})

export const tbody = style({
  backgroundColor: 'hsla(231, 67%, 99%, 1)',
  fontWeight: themeVars.typography.fontWeight.bold,
})

export const bodyCell = style({
  paddingBottom: '32px',
  selectors: {
    '&:nth-child(1)': {
      paddingLeft: '32px',
      textAlign: 'left',
      color: themeVars.color.text.strong,
    },
    '&:nth-child(2)': {
      textAlign: 'center',
    },
    '&:nth-child(3)': {
      textAlign: 'right',
    },
    '&:nth-child(4)': {
      paddingRight: '32px',
      textAlign: 'right',
      color: themeVars.color.text.strong,
    },
    'tr:last-child > &': {
      paddingBottom: '40px',
    },
  },
})

export const tfoot = style({
  backgroundColor: 'hsla(231, 20%, 27%, 1)',
  color: 'white',
})

export const totalHeader = style({
  paddingLeft: '32px',
  textAlign: 'left',
  fontSize: themeVars.typography.body2.fontSize,
  lineHeight: themeVars.typography.body2.lineHeight,
  letterSpacing: themeVars.typography.body2.letterSpacing,
  fontWeight: themeVars.typography.fontWeight.normal,
})

export const totalValue = style({
  paddingRight: '32px',
  paddingTop: '24px',
  paddingBottom: '24px',
  textAlign: 'right',
  fontSize: `${24 / 16}rem`,
  letterSpacing: '-0.5px',
  lineHeight: `${32 / 16}rem`,
  fontWeight: themeVars.typography.fontWeight.bold,
})

export const backButton = style({
  marginTop: '64px',
  marginBottom: '32px',
  border: 'none',
  backgroundColor: 'transparent',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'baseline',
  gap: '24px',
  fontWeight: themeVars.typography.fontWeight.bold,
  color: themeVars.color.text.strong,
  cursor: 'pointer',
})

export const backButtonIcon = style({
  height: themeVars.typography.body1.fontSize,
  color: themeVars.color.text.normal,
})
