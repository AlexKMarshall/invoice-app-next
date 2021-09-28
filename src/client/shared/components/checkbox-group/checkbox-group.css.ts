import { style } from '@vanilla-extract/css'
import { themeVars } from 'src/client/shared/styles/theme.css'

export const checkboxGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
})

export const checkboxWrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  color: themeVars.color.text.strong,
  fontWeight: themeVars.typography.fontWeight.bold,
})

export const checkbox = style({
  display: 'grid',
  placeItems: 'center',
  height: '1rem',
  width: '1rem',
  backgroundColor: themeVars.color.muted.hover,
  borderRadius: '2px',

  selectors: {
    'input[aria-checked="true"] ~ &': {
      backgroundColor: themeVars.color.primary.main,
    },
    'input:hover ~ &': {
      border: '2px solid',
      borderColor: themeVars.color.primary.main,
    },
    'input:focus-visible ~ &': {
      boxShadow: `0px 0px 0px 2px white, 0px 0px 0px 4px ${themeVars.color.primary.main}`,
      outline: '1px solid transparent',
    },
  },
})

export const checkmark = style({
  width: '10px',
  color: 'white',
  opacity: 0,

  selectors: {
    [`input[aria-checked="true"] ~ ${checkbox} > &`]: {
      opacity: 1,
    },
  },
})
