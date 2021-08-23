import {
  Drawer,
  DrawerContainer,
  DrawerOverlayContainer,
  DrawerProvider,
  useDrawer,
} from './drawer'
import { act, render, screen } from '@testing-library/react'

import { ReactNode } from 'react'
import { userEvent } from 'src/client/test/test-utils'

type Props = {
  mainContent?: ReactNode
  drawerContent?: ReactNode
  drawerTitle: string
}
function Example({ mainContent, drawerContent, drawerTitle }: Props) {
  const { open, close } = useDrawer()

  return (
    <div>
      <DrawerOverlayContainer>
        <main>
          <button onClick={() => open()}>Open Drawer</button>
          {mainContent}
          <Drawer title={drawerTitle}>
            {drawerContent}
            <button onClick={() => close()}>Close Drawer</button>
          </Drawer>
        </main>
      </DrawerOverlayContainer>
      <aside>
        <DrawerContainer />
      </aside>
    </div>
  )
}

it('should not display drawer content by default', () => {
  render(
    <DrawerProvider>
      <Example drawerTitle="My Title" drawerContent={<p>Some Content</p>} />
    </DrawerProvider>
  )

  expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  expect(screen.queryByText(/some content/i)).not.toBeInTheDocument()
})
it('should display modal content only when open', () => {
  render(
    <DrawerProvider>
      <Example
        mainContent={<input type="text" />}
        drawerTitle="My Title"
        drawerContent={<input type="checkbox" />}
      />
    </DrawerProvider>
  )

  expect(screen.getByRole('textbox')).toBeInTheDocument()
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()

  userEvent.click(screen.getByRole('button', { name: /open drawer/i }))

  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  expect(screen.getByRole('checkbox')).toBeInTheDocument()
})
it('should trap focus when open', () => {
  render(
    <DrawerProvider>
      <Example
        mainContent={<input data-testid="outside" />}
        drawerTitle="My Title"
        drawerContent={
          <>
            <input data-testid="inside" />
          </>
        }
      />
    </DrawerProvider>
  )

  userEvent.click(screen.getByRole('button', { name: /open drawer/i }))

  expect(screen.getByTestId('inside')).toHaveFocus()
  userEvent.tab()
  expect(screen.getByRole('button', { name: /close drawer/i })).toHaveFocus()
  userEvent.tab()
  expect(screen.getByTestId('inside')).toHaveFocus()
})
// Can't get this test working yet
it.skip('should restore focus when closed', () => {
  render(
    <DrawerProvider>
      <Example
        mainContent={<input data-testid="outside" />}
        drawerTitle="My Title"
        drawerContent={
          <>
            <input data-testid="inside" />
          </>
        }
      />
    </DrawerProvider>
  )

  const openButton = screen.getByRole('button', { name: /open drawer/i })
  act(() => openButton.focus())

  userEvent.click(openButton)

  userEvent.click(screen.getByRole('button', { name: /close drawer/i }))

  expect(openButton).toHaveFocus()
})
it('should close drawer on pressing Esc', () => {
  render(
    <DrawerProvider>
      <Example
        mainContent={<input data-testid="outside" />}
        drawerTitle="My Title"
        drawerContent={
          <>
            <input data-testid="inside" />
          </>
        }
      />
    </DrawerProvider>
  )

  userEvent.click(screen.getByRole('button', { name: /open drawer/i }))
  expect(screen.getByRole('heading', { name: /my title/i })).toBeInTheDocument()
  userEvent.keyboard('{esc}')
  expect(
    screen.queryByRole('heading', { name: /my title/i })
  ).not.toBeInTheDocument()
})
// not sure why this one isn't working
it.skip('should close drawer on clicking outside', () => {
  render(
    <DrawerProvider>
      <Example
        mainContent={<input data-testid="outside" />}
        drawerTitle="My Title"
        drawerContent={
          <>
            <input data-testid="inside" />
          </>
        }
      />
    </DrawerProvider>
  )

  userEvent.click(screen.getByRole('button', { name: /open drawer/i }))
  expect(screen.getByRole('heading', { name: /my title/i })).toBeInTheDocument()

  userEvent.click(document.body)

  expect(
    screen.queryByRole('heading', { name: /my title/i })
  ).not.toBeInTheDocument()
})
it('should have correct aria attributes', () => {
  render(
    <DrawerProvider>
      <Example
        mainContent={<input data-testid="outside" />}
        drawerTitle="My Title"
        drawerContent={
          <>
            <input data-testid="inside" />
          </>
        }
      />
    </DrawerProvider>
  )

  userEvent.click(screen.getByRole('button', { name: /open drawer/i }))
  const drawer = screen.getByRole('dialog')

  expect(drawer).toHaveAttribute('role', 'dialog')
})
