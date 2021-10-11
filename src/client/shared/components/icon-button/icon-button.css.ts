import { style } from '@vanilla-extract/css'
import { themeVars } from 'src/client/shared/styles/theme.css'

export const iconButton = style({
  background: 'none',
  border: 'none',
  padding: themeVars.layout.size[-3],
})
