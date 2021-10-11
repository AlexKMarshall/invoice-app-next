import { recipe } from '@vanilla-extract/recipes'
import { themeVars } from '../../styles/theme.css'

export const sizeVariants = {
  '-3': {
    gap: themeVars.layout.size[-3],
  },
  '-2': {
    gap: themeVars.layout.size[-2],
  },
  '-1': {
    gap: themeVars.layout.size[-1],
  },
  '0': {
    gap: themeVars.layout.size[0],
  },
  '1': {
    gap: themeVars.layout.size[1],
  },
  '2': {
    gap: themeVars.layout.size[2],
  },
  '3': {
    gap: themeVars.layout.size[3],
  },
  '4': {
    gap: themeVars.layout.size[4],
  },
  '5': {
    gap: themeVars.layout.size[5],
  },
  '6': {
    gap: themeVars.layout.size[6],
  },
  '7': {
    gap: themeVars.layout.size[7],
  },
}

export const stack = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
  },

  variants: {
    size: sizeVariants,
  },

  defaultVariants: {
    size: '0',
  },
})
