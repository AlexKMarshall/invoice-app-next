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
}
