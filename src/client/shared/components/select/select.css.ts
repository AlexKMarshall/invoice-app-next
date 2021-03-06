import { assignVars, createThemeContract, style } from '@vanilla-extract/css'

import { recipe } from '@vanilla-extract/recipes'
import { themeVars } from 'src/client/shared/styles/theme.css'

const colorVars = createThemeContract({
  text: null,
  outline: null,
  border: null,
})

export const wrapper = recipe({
  base: {
    color: colorVars.text,
    outlineColor: colorVars.outline,
    borderColor: colorVars.border,
  },

  variants: {
    status: {
      valid: {
        vars: assignVars(colorVars, {
          text: themeVars.color.text.normal,
          outline: themeVars.color.primary.main,
          border: themeVars.color.fieldBoder,
        }),
      },
      error: {
        vars: assignVars(colorVars, {
          text: themeVars.color.warning.main,
          outline: themeVars.color.warning.main,
          border: themeVars.color.warning.main,
        }),
      },
    },
    disabled: {
      true: {
        opacity: '50%',
      },
    },
  },

  defaultVariants: {
    status: 'valid',
  },
})

export const labelWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
})

export const select = style({
  paddingBlock: themeVars.layout.size[0],
  paddingInline: themeVars.layout.size[1],
  border: '1px solid',
  borderColor: 'inherit',
  outlineColor: 'inherit',
  color: themeVars.color.text.strong,
  borderRadius: themeVars.layout.borderRadius.s,
  fontWeight: themeVars.typography.fontWeight.bold,
  lineHeight: themeVars.typography.body1.lineHeight,
})
