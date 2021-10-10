import { createVar, style } from '@vanilla-extract/css'

import { calc } from '@vanilla-extract/css-utils'
import { themeVars } from 'src/client/shared/styles/theme.css'

export const underlay = style({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: 'hsla(0, 0%, 0%, 50%)',
  display: 'flex',
})

const padding = createVar()

export const overlay = style({
  maxWidth: '80vw',
  padding: padding,
  paddingLeft: calc.add(padding, themeVars.layout.sidebarDepth.desktop),
  backgroundColor: 'white',
  borderTopRightRadius: themeVars.layout.borderRadius.xl,
  borderBottomRightRadius: themeVars.layout.borderRadius.xl,

  vars: {
    [padding]: themeVars.layout.size[6],
  },

  '@media': {
    'screen and (max-width: 1023px)': {
      paddingLeft: padding,
      paddingTop: calc.add(padding, themeVars.layout.sidebarDepth.mobile),
    },
  },
})
