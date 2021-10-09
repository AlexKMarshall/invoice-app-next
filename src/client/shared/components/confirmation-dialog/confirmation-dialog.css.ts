import { style } from '@vanilla-extract/css'
import { themeVars } from 'src/client/shared/styles/theme.css'

export const underlay = style({
  position: 'fixed',
  zIndex: 100,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundColor: 'hsla(0, 0%, 0%, 0.5)',
  display: 'grid',
  placeItems: 'center',
})

export const overlay = style({
  padding: '48px',
  backgroundColor: 'white',
  borderRadius: themeVars.layout.borderRadius.l,
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: 'min(480px, 80%)',
})

export const heading = style({
  fontSize: `${24 / 16}rem`,
  lineHeight: '32px',
  letterSpacing: '-0.5px',
  fontWeight: themeVars.typography.fontWeight.bold,
  color: themeVars.color.text.strong,
})

export const actionButtons = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.5rem',
})
