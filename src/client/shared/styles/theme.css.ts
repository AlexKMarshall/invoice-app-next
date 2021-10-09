import { createGlobalTheme } from '@vanilla-extract/css'

export const themeVars = createGlobalTheme(':root', {
  color: {
    primary: {
      main: 'hsla(252, 94%, 67%, 1)',
      light: 'hsla(252, 100%, 73%, 1)',
    },
    muted: {
      main: 'hsla(231, 67%, 99%, 1)',
      hover: 'hsla(231, 73%, 93%, 1)',
    },
    mono: {
      main: 'hsla(231, 20%, 27%, 1)',
      hover: 'hsla(231, 28%, 7%, 1)',
      contrastText: 'hsla(231, 20%, 61%, 1)',
    },
    body: 'hsla(240, 27%, 98%, 1)',
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
    warning: {
      main: 'hsla(0, 80%, 63%, 1)',
      hover: 'hsla(0, 100%, 80%, 1)',
      contrastText: 'hsla(0, 100%, 100%, 1)',
    },
    text: {
      normal: 'hsla(231, 37%, 63%, 1)',
      strong: 'hsla(231, 28%, 7%, 1)',
    },
    fieldBoder: 'hsla(231, 75%, 93%, 1)',
    shadow: 'hsla(231, 38%, 45%, 10%)',
  },
  typography: {
    fontWeight: {
      bold: '700',
      normal: '500',
    },
    h1: {
      fontSize: `${32 / 16}rem`,
      lineHeight: `${36 / 16}rem`,
      letterSpacing: '-1px',
    },
    h2: {
      fontSize: `${20 / 16}rem`,
      lineHeight: `${22 / 16}rem`,
      letterSpacing: '-0.63px',
    },
    h3: {
      fontSize: '1rem',
      lineHeight: '-0.8px',
      letterSpacing: '-1px',
    },
    body1: {
      fontSize: `${12 / 16}rem`,
      lineHeight: '1.5em',
      letterSpacing: '-0.25px',
    },
    body2: {
      fontSize: `${11 / 16}rem`,
      lineHeight: '1.5em',
      letterSpacing: '-0.23px',
    },
  },
  layout: {
    borderRadius: {
      xs: '2px',
      s: '4px',
      m: '6px',
      l: '8px',
      xl: '20px',
      circle: '50%',
      pill: '100vh',
    },
    measure: '75ch',
    size: {
      '-3': `${scale(-3)}rem`,
      '-2': `${scale(-2)}rem`,
      '-1': `${scale(-1)}rem`,
      '0': `${scale(0)}rem`,
      '1': `${scale(1)}rem`,
      '2': `${scale(2)}rem`,
      '3': `${scale(3)}rem`,
      '4': `${scale(4)}rem`,
      '5': `${scale(5)}rem`,
      '6': `${scale(6)}rem`,
      '7': `${scale(7)}rem`,
    },
  },
})

function scale(level: number) {
  const scaleRhythm = 1.25
  return 1 * Math.pow(scaleRhythm, level)
}
