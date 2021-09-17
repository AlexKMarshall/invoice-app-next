import { createVar, style } from '@vanilla-extract/css'

export const underlay = style({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: 'hsla(0, 0%, 0%, 50%)',
  display: 'flex',
})

const sidebarWidth = createVar()

export const overlay = style({
  maxWidth: '80vw',
  padding: '56px',
  // TODO make this dynamic based on sidebar width
  paddingLeft: `calc(104px + ${sidebarWidth})`,
  backgroundColor: 'white',
  overflowY: 'auto',

  vars: {
    [sidebarWidth]: '104px',
  },
})
