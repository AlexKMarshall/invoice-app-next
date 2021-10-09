import { createThemeContract, createVar, style } from '@vanilla-extract/css'

import { calc } from '@vanilla-extract/css-utils'
import { recipe } from '@vanilla-extract/recipes'
import { themeVars } from 'src/client/shared/styles/theme.css'

const horizontalPadding = createVar()
const verticalPadding = createVar()
const iconSize = createVar()
export const prefixContent = createVar()

const colorVars = createThemeContract({
  idleBackground: null,
  background: null,
  hoverBackground: null,
  focusOutline: null,
  text: null,
})

export const button = recipe({
  base: {
    position: 'relative',
    padding: `${verticalPadding} ${horizontalPadding}`,
    border: '2px solid transparent',
    backgroundClip: 'padding-box',
    borderRadius: themeVars.layout.borderRadius.pill,
    backgroundColor: colorVars.background,
    color: colorVars.text,
    fontWeight: themeVars.typography.fontWeight.bold,

    ':hover': {
      vars: {
        [colorVars.background]: colorVars.hoverBackground,
      },
    },

    ':focus-visible': {
      borderColor: 'white',
      boxShadow: `0 0 0 2px ${colorVars.focusOutline}`,
      outline: '1px solid transparent',
    },

    vars: {
      [horizontalPadding]: '1.5rem',
      [verticalPadding]: '1rem',
      [colorVars.background]: colorVars.idleBackground,
      [colorVars.focusOutline]: colorVars.background,
    },
  },

  variants: {
    kind: {
      icon: {
        paddingLeft: calc.add(horizontalPadding, iconSize),
        vars: {
          [iconSize]: '32px',
        },
      },
      prefix: {
        ':before': {
          content: prefixContent,
          display: 'inlineBlock',
          marginRight: '0.5ch',
        },
      },
    },
    color: {
      primary: {
        vars: {
          [colorVars.idleBackground]: themeVars.color.primary.main,
          [colorVars.hoverBackground]: themeVars.color.primary.light,
          [colorVars.text]: 'white',
        },
      },
      muted: {
        vars: {
          [colorVars.idleBackground]: themeVars.color.muted.main,
          [colorVars.hoverBackground]: themeVars.color.muted.hover,
          [colorVars.focusOutline]: colorVars.hoverBackground,
          [colorVars.text]: themeVars.color.text.normal,
        },
      },
      mono: {
        vars: {
          [colorVars.idleBackground]: themeVars.color.mono.main,
          [colorVars.hoverBackground]: themeVars.color.mono.hover,
          [colorVars.text]: themeVars.color.mono.contrastText,
        },
      },
      warning: {
        vars: {
          [colorVars.idleBackground]: themeVars.color.warning.main,
          [colorVars.hoverBackground]: themeVars.color.warning.hover,
          [colorVars.text]: themeVars.color.warning.contrastText,
        },
      },
    },
  },

  defaultVariants: {
    color: 'primary',
  },
})

export const iconWrapper = style({
  width: iconSize,
  height: iconSize,
  backgroundColor: 'white',
  color: colorVars.background,
  position: 'absolute',
  borderRadius: themeVars.layout.borderRadius.circle,
  top: '8px',
  left: '8px',
  display: 'grid',
  placeItems: 'center',
})

export const iconSvg = style({
  width: '10px',
  height: '10px',
})
