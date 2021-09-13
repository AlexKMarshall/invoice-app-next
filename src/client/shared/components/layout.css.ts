import { createVar, globalStyle, style } from '@vanilla-extract/css'

import { themeVars } from '../styles/theme.css'

export const layoutWrapper = style({
  display: 'grid',
  gridTemplateColumns: `auto 1fr`,
  gridTemplateAreas: `'sidebar main'`,
})

export const mainWrapper = style({
  width: '100%',
  maxWidth: 730,
  marginLeft: 'auto',
  marginRight: 'auto',
  gridArea: 'main',
})

const borderRadius = createVar()

export const sidebarWrapper = style({
  height: '100vh',
  width: 'fit-content',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gridArea: 'sidebar',
  position: 'sticky',
  top: 0,
  backgroundColor: themeVars.color.sidebar,

  vars: {
    [borderRadius]: '20px',
  },

  borderTopRightRadius: borderRadius,
  borderBottomRightRadius: borderRadius,
  overflow: 'hidden',
})

export const logoBox = style({
  padding: '1.5rem 2rem',
  backgroundColor: themeVars.color.primary.main,
  marginBottom: 'auto',
  position: 'relative',
  overflow: 'hidden',
  borderBottomRightRadius: borderRadius,
  zIndex: -2,

  ':after': {
    content: `''`,
    position: 'absolute',
    backgroundColor: themeVars.color.primary.light,
    borderTopLeftRadius: borderRadius,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transform: 'translateY(50%)',
    zIndex: -1,
  },
})

export const logo = style({
  width: '40px',
})

export const avatarBox = style({
  padding: '1.5rem 2rem',
  borderTop: `2px solid ${themeVars.color.divider}`,
})

export const avatarImageWrapper = style({
  width: 'fit-content',
  clipPath: 'circle(50%)',
})

/* NextJS Image component sets inline-block on its wrapper, and it's otherwise impossible to change
  as of version 11.1.0 */
globalStyle(`${avatarImageWrapper} > *`, {
  display: 'block !important',
})
