import { style } from '@vanilla-extract/css'

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
  borderRadius: '8px',
})
