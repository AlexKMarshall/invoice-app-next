import { createVar, style } from '@vanilla-extract/css'

import { calc } from '@vanilla-extract/css-utils'
import { themeVars } from '../../styles/theme.css'

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
  paddingLeft: calc.add(padding, themeVars.layout.sidebarDepth),
  backgroundColor: 'white',
  overflowY: 'auto',

  vars: {
    [padding]: themeVars.layout.size[6],
  },
})
