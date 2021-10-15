import { createVar, globalStyle, style } from '@vanilla-extract/css'

import { themeVars } from 'src/client/shared/styles/theme.css'

export const layoutWrapper = style({
  display: 'grid',
  gridTemplateColumns: `auto 1fr`,
  gridTemplateAreas: `'sidebar main'`,

  '@media': {
    'screen and (max-width: 1023px)': {
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `'sidebar'
      'main'`,
    },
  },
})

export const mainWrapper = style({
  width: '100%',
  maxWidth: themeVars.layout.measure,
  marginLeft: 'auto',
  marginRight: 'auto',
  gridArea: 'main',
})

const borderRadius = createVar()

export const sidebarWrapper = style({
  height: '100vh',
  width: themeVars.layout.sidebarDepth.desktop,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  gridArea: 'sidebar',
  position: 'sticky',
  top: 0,
  backgroundColor: themeVars.color.sidebar,
  borderTopRightRadius: borderRadius,
  borderBottomRightRadius: borderRadius,
  overflow: 'hidden',
  isolation: 'isolate',

  vars: {
    [borderRadius]: themeVars.layout.borderRadius.xl,
  },

  '@media': {
    'screen and (max-width: 1023px)': {
      width: 'auto',
      height: themeVars.layout.sidebarDepth.mobile,
      flexDirection: 'row',
      position: 'static',
      top: 'unset',
      borderRadius: 0,
    },
  },
})

export const logoBox = style({
  paddingBlock: themeVars.layout.size[2],
  paddingInline: themeVars.layout.size[3],
  backgroundColor: themeVars.color.primary.main,
  position: 'relative',
  overflow: 'hidden',
  borderTopRightRadius: borderRadius,
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
  paddingBlock: themeVars.layout.size[2],
  paddingInline: themeVars.layout.size[3],
  borderColor: themeVars.color.divider,
  borderWidth: 0,
  borderStyle: 'solid',
  borderTopWidth: '2px',

  '@media': {
    'screen and (max-width: 1023px)': {
      borderTopWidth: 0,
      borderLeftWidth: '2px',
    },
  },
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
