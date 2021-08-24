export const COLORS = {
  bodyColor: {
    value: 'hsla(240, 27%, 98%, 100%)',
    prop: 'var(--body-color)',
  },
  textColor: {
    value: 'hsla(231deg, 37%, 63%, 100%)',
    prop: 'var(--text-color)',
    strong: {
      value: ' hsla(231deg, 28%, 7%, 100%)',
      prop: 'var(--text-color-strong)',
    },
  },
  primaryColor: {
    value: 'hsla(252deg, 94%, 67%, 100%)',
    prop: 'var(--primary-color)',
    light: {
      value: 'hsla(252deg, 100%, 73%, 100%)',
      prop: 'var(--primary-color-light)',
    },
  },
  mutedColor: {
    value: 'hsla(231deg, 67%, 99%, 100%)',
    prop: 'var(--muted-color)',
    hover: {
      value: 'hsla(231deg, 73%, 93%, 100%)',
      prop: 'var(--muted-color-hover)',
    },
  },
  monoColor: {
    value: 'hsla(231deg, 20%, 27%, 100%)',
    prop: 'var(--mono-color)',
    hover: {
      value: 'hsla(231deg, 28%, 7%, 100%)',
      prop: 'var(--mono-color-hover)',
    },
    text: {
      value: 'hsla(231deg, 20%, 61%, 100%)',
      prop: 'var(--mono-color-text)',
    },
  },
  statusColor: {
    draft: {
      value: 'hsla(231deg, 20%, 27%, 100%)',
      prop: 'var(--status-color-draft)',
      faded: {
        value: 'hsla(231deg, 20%, 27%, 6%)',
        prop: 'var(--status-color-draft-faded)',
      },
    },
    pending: {
      value: 'hsla(34deg, 100%, 50%, 100%)',
      prop: 'var(--status-color-pending)',
      faded: {
        value: 'hsla(34deg, 100%, 50%, 6%)',
        prop: 'var(--status-color-pending-faded)',
      },
    },
    paid: {
      value: 'hsla(160deg, 67%, 52%, 100%)',
      prop: 'var(--status-color-paid)',
      faded: {
        value: 'hsla(160deg, 67%, 52%, 6%)',
        prop: 'var(--status-color-paid-faded)',
      },
    },
  },
  shadowColor: {
    value: 'hsla(231deg, 38%, 45%, 10%)',
    prop: 'var(--shadow-color)',
  },
  sidebarColor: {
    value: 'hsla(231, 20%, 27%, 100%)',
    prop: 'var(--sidebar-color)',
  },
  dividerColor: {
    value: 'hsla(231, 20%, 36%, 100%)',
    prop: 'var(--divider-color)',
  },
  fieldBorderColor: {
    value: 'hsla(231deg, 75%, 93%, 100%)',
    prop: 'var(--field-border-color)',
  },
}

export const TYPOGRAPHY = {
  fontWeight: {
    normal: {
      value: 500,
      prop: 'var(--font-weight-normal)',
    },
    bold: {
      value: 700,
      prop: 'var(--font-weight-bold)',
    },
  },
  h1: {
    fontSize: {
      value: `${32 / 16}rem`,
      prop: 'var(--h1-font-size)',
    },
    lineHeight: {
      value: `${36 / 16}rem`,
      prop: 'var(--h1-line-height)',
    },
    letterSpacing: {
      value: '-1px',
      prop: 'var(--h1-letter-spacing)',
    },
  },
  h2: {
    fontSize: {
      value: `${20 / 16}rem`,
      prop: 'var(--h2-font-size)',
    },
    lineHeight: {
      value: `${22 / 16}rem`,
      prop: 'var(--h2-line-height)',
    },
    letterSpacing: {
      value: '-0.63px',
      prop: 'var(--h2-letter-spacing)',
    },
  },
  h3: {
    fontSize: {
      value: `1rem`,
      prop: 'var(--h3-font-size)',
    },
    lineHeight: {
      value: `${24 / 16}rem`,
      prop: 'var(--h3-line-height)',
    },
    letterSpacing: {
      value: '-0.8px',
      prop: 'var(--h3-letter-spacing)',
    },
  },
  body1: {
    fontSize: {
      value: `${12 / 16}rem`,
      prop: 'var(--body1-font-size)',
    },
    letterSpacing: {
      value: '-0.25px',
      prop: 'var(--body1-letter-spacing)',
    },
  },
}
