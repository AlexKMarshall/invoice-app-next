import { style } from '@vanilla-extract/css'
import { themeVars } from 'src/client/shared/styles/theme.css'

export const filterButton = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: themeVars.layout.size[0],
  color: themeVars.color.text.strong,
  fontWeight: themeVars.typography.fontWeight.bold,
  background: 'transparent',
  padding: themeVars.layout.size[0],
  border: 'none',
})

export const downChevron = style({
  width: '10px',
  color: themeVars.color.text.normal,
})

export const popover = style({
  padding: themeVars.layout.size[2],
  minWidth: '10rem',
  backgroundColor: 'white',
  borderRadius: themeVars.layout.borderRadius.l,
  boxShadow: `0px 10px 10px ${themeVars.color.shadow}`,
})
