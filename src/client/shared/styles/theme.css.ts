import { createGlobalTheme } from '@vanilla-extract/css'

export const themeVars = createGlobalTheme(':root', {
  color: {
    primary: {
      main: 'hsla(252, 94%, 67%, 1)',
      light: 'hsla(252, 100%, 73%, 1)',
    },
    sidebar: 'hsla(231, 20%, 27%, 1)',
    divider: 'hsla(231, 20%, 36%, 1)',
  },
})
