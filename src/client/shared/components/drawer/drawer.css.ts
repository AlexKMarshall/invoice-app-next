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

const sidebarWidth = createVar()
const padding = createVar()

export const overlay = style({
  maxWidth: '80vw',
  padding: padding,
  paddingLeft: calc.add(padding, sidebarWidth),
  backgroundColor: 'white',
  overflowY: 'auto',

  vars: {
    // TODO make this dynamic based on sidebar width
    [sidebarWidth]: '102.5px',
    [padding]: themeVars.layout.size[6],
  },
})
