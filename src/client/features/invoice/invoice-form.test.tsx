import {
  render,
  screen,
  userEvent,
  waitForElementToBeRemoved,
  within,
} from 'src/client/test/test-utils'

import { InvoiceForm } from './invoice-form'
import { format } from 'date-fns'
import { store } from 'src/client/test/mocks/invoice.model'

const noop = () => void 0

const defaultFormProps = {
  kind: 'create' as const,
  'aria-labelledby': 'some-id',
  onSubmit: noop,
}

it('should be possible to add and delete invoice items', async () => {
  render(<InvoiceForm {...defaultFormProps} />)

  const itemsList = screen.getByRole('table', { name: /item list/i })

  // we should only have a header row on a brand new invoice
  expect(within(itemsList).getAllByRole('row')).toHaveLength(1)

  await userEvent.click(screen.getByRole('button', { name: /add new item/i }))
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
it('should default invoice issue date to today', async () => {
  const today = new Date()
  render(<InvoiceForm {...defaultFormProps} />)

  expect(screen.getByLabelText(/issue date/i)).toHaveValue(
    format(today, 'yyyy-MM-dd')
  )
})
it('should have a payment term selector', async () => {
  render(<InvoiceForm {...defaultFormProps} />)

  const paymentTermsSelect = screen.getByRole('combobox', {
    name: /payment terms/i,
  })

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i))

  store.paymentTerms.forEach((term) => {
    const option = within(paymentTermsSelect).getByRole('option', {
      name: term.name,
    })
    expect(option).toHaveValue(term.value.toString())
  })
})
