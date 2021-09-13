import { createGlobalTheme } from '@vanilla-extract/css'

export const themeVars = createGlobalTheme(':root', {
  color: {
    primary: {
      main: 'hsla(252, 94%, 67%, 1)',
      light: 'hsla(252, 100%, 73%, 1)',
    },
    status: {
      draft: {
        main: 'hsla(231, 20%, 27%, 1)',
        faded: 'hsla(231, 20%, 27%, 6%)',
      },
      pending: {
        main: 'hsla(34, 100%, 50%, 1)',
        faded: 'hsla(34, 100%, 50%, 6%)',
      },
      paid: {
        main: 'hsla(160, 67%, 52%, 1)',
        faded: 'hsla(160, 67%, 52%, 6%)',
      },
    },
    sidebar: 'hsla(231, 20%, 27%, 1)',
    divider: 'hsla(231, 20%, 36%, 1)',
  },
  typography: {
    fontWeight: {
      bold: '700',
      normal: '500',
    },
  },
})
