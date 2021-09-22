import { render, screen, userEvent, within } from 'src/client/test/test-utils'

import { InvoiceForm } from './invoice-form'

it('should be possible to add and delete invoice items', () => {
  render(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <InvoiceForm kind="create" aria-labelledby="some-id" onSubmit={() => {}} />
  )

  const itemsList = screen.getByRole('table', { name: /item list/i })

  // we should only have a header row on a brand new invoice
  expect(within(itemsList).getAllByRole('row')).toHaveLength(1)

  userEvent.click(screen.getByRole('button', { name: /add new item/i }))
  const [firstAddedItemRow] = within(itemsList).getAllByRole('row').slice(-1)
  userEvent.type(
    within(firstAddedItemRow).getByLabelText(/item name/i),
    'my first item'
  )

  userEvent.click(screen.getByRole('button', { name: /add new item/i }))
  const [secondAddedItemRow] = within(itemsList).getAllByRole('row').slice(-1)
  userEvent.type(
    within(secondAddedItemRow).getByLabelText(/item name/i),
    'my second item'
  )

  // we should have the header plus 2 item rows
  expect(within(itemsList).getAllByRole('row')).toHaveLength(3)

  // delete the first item
  userEvent.click(
    within(firstAddedItemRow).getByRole('button', { name: /delete/i })
  )

  expect(within(itemsList).getAllByRole('row')).toHaveLength(2)
  expect(screen.getByDisplayValue(/my second item/i)).toBeInTheDocument()
  expect(screen.queryByDisplayValue(/my first item/i)).not.toBeInTheDocument()
})
