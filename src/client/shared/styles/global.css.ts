import { globalStyle } from '@vanilla-extract/css'
import { themeVars } from './theme.css'

globalStyle('body', {
  overflowY: 'scroll',
  fontFamily: `'Spartan', sans-serif`,
  fontSize: themeVars.typography.body1.fontSize,
  lineHeight: themeVars.typography.body1.lineHeight,
  letterSpacing: themeVars.typography.body1.letterSpacing,
  fontWeight: themeVars.typography.fontWeight.normal,
  backgroundColor: themeVars.color.body,
  color: themeVars.color.text.normal,
})
