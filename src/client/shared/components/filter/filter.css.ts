import { style } from '@vanilla-extract/css'
import { themeVars } from 'src/client/shared/styles/theme.css'

export const filterButton = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '1rem',
  color: themeVars.color.text.strong,
  fontWeight: themeVars.typography.fontWeight.bold,
  background: 'transparent',
  padding: '1rem',
  border: 'none',
})

export const downChevron = style({
  width: '10px',
  color: themeVars.color.text.normal,
})
