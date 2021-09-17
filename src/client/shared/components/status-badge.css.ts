import {
  assignVars,
  createThemeContract,
  createVar,
} from '@vanilla-extract/css'

import { recipe } from '@vanilla-extract/recipes'
import { themeVars } from '../styles/theme.css'

const size = createVar()

const colorVars = createThemeContract({
  opaque: null,
  faded: null,
})

export const statusBadge = recipe({
  base: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    padding: '12px 18px 13px 18px',
    borderRadius: '6px',
    fontWeight: themeVars.typography.fontWeight.bold,
    textTransform: 'capitalize',
    backgroundColor: colorVars.faded,
    color: colorVars.opaque,

    vars: {
      [size]: '0.5rem',
    },

    ':before': {
      content: `''`,
      width: size,
      height: size,
      marginRight: size,
      borderRadius: '50%',
      backgroundColor: colorVars.opaque,
    },
  },

  variants: {
    status: {
      draft: {
        vars: assignVars(colorVars, {
          opaque: themeVars.color.status.draft.main,
          faded: themeVars.color.status.draft.faded,
        }),
      },
      pending: {
        vars: assignVars(colorVars, {
          opaque: themeVars.color.status.pending.main,
          faded: themeVars.color.status.pending.faded,
        }),
      },
      paid: {
        vars: assignVars(colorVars, {
          opaque: themeVars.color.status.paid.main,
          faded: themeVars.color.status.paid.faded,
        }),
      },
    },
  },
})