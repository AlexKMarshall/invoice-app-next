import { assignVars, createThemeContract } from '@vanilla-extract/css'

import { recipe } from '@vanilla-extract/recipes'
import { themeVars } from 'src/client/shared/styles/theme.css'

const fontVars = createThemeContract({
  size: null,
  lineHeight: null,
  letterSpacing: null,
})

export const heading = recipe({
  base: {
    fontWeight: themeVars.typography.fontWeight.bold,
  },

  variants: {
    level: {
      1: {
        vars: assignVars(fontVars, {
          size: themeVars.typography.h1.fontSize,
          lineHeight: themeVars.typography.h1.lineHeight,
          letterSpacing: themeVars.typography.h1.letterSpacing,
        }),
      },
      2: {
        vars: assignVars(fontVars, {
          size: themeVars.typography.h2.fontSize,
          lineHeight: themeVars.typography.h2.lineHeight,
          letterSpacing: themeVars.typography.h2.letterSpacing,
        }),
      },
      3: {
        vars: assignVars(fontVars, {
          size: themeVars.typography.h3.fontSize,
          lineHeight: themeVars.typography.h3.lineHeight,
          letterSpacing: themeVars.typography.h3.letterSpacing,
        }),
      },
    },
  },
})
