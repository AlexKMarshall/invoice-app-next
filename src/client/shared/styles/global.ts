import { COLORS, TYPOGRAPHY } from './theme'

import { createGlobalStyle } from 'styled-components'

export const Global = createGlobalStyle`
  :root {
    /* COLORS */
    --body-color: ${COLORS.bodyColor.value};
    --text-color: ${COLORS.textColor.value};
    --text-color-strong: ${COLORS.textColor.strong.value};
    --primary-color: ${COLORS.primaryColor.value};
    --primary-color-light: ${COLORS.primaryColor.light.value};
    --muted-color: ${COLORS.mutedColor.value};
    --muted-color-hover: ${COLORS.mutedColor.hover.value};
    --mono-color: ${COLORS.monoColor.value};
    --mono-color-hover: ${COLORS.monoColor.hover.value};
    --mono-color-text: ${COLORS.monoColor.text.value};
    --status-color-draft: ${COLORS.statusColor.draft.value};
    --status-color-draft-faded: ${COLORS.statusColor.draft.faded.value};
    --status-color-pending: ${COLORS.statusColor.pending.value};
    --status-color-pending-faded: ${COLORS.statusColor.pending.faded.value};
    --status-color-paid: ${COLORS.statusColor.paid.value};
    --status-color-paid-faded: ${COLORS.statusColor.paid.faded.value};
    --shadow-color: ${COLORS.shadowColor.value};
    --sidebar-color: ${COLORS.sidebarColor.value};
    --divider-color: ${COLORS.dividerColor.value};
    --field-border-color: ${COLORS.fieldBorderColor.value};
    --warning-color: ${COLORS.warningColor.value};
    /* TYPOGRAPHY */
    --h1-font-size: ${TYPOGRAPHY.h1.fontSize.value};
    --h1-line-height: ${TYPOGRAPHY.h1.lineHeight.value};
    --h1-letter-spacing: ${TYPOGRAPHY.h1.letterSpacing.value};
    --h2-font-size: ${TYPOGRAPHY.h2.fontSize.value};
    --h2-line-height: ${TYPOGRAPHY.h2.lineHeight.value};
    --h2-letter-spacing: ${TYPOGRAPHY.h2.letterSpacing.value};
    --h3-font-size: ${TYPOGRAPHY.h3.fontSize.value};
    --h3-line-height: ${TYPOGRAPHY.h3.lineHeight.value};
    --h3-letter-spacing: ${TYPOGRAPHY.h3.letterSpacing.value};
    --body1-font-size: ${TYPOGRAPHY.body1.fontSize.value};
    --body1-letter-spacing: ${TYPOGRAPHY.body1.letterSpacing.value};
    --font-weight-normal: ${TYPOGRAPHY.fontWeight.normal.value};
    --font-weight-bold: ${TYPOGRAPHY.fontWeight.bold.value};
  }

  body {
    font-family: 'Spartan', sans-serif;
    font-size: ${TYPOGRAPHY.body1.fontSize.prop};
    font-weight: ${TYPOGRAPHY.fontWeight.normal.prop};
    letter-spacing: ${TYPOGRAPHY.body1.letterSpacing.prop};

    background-color: ${COLORS.bodyColor.prop};
    color: ${COLORS.textColor.prop};
  }
`
