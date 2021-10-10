import { render, screen, within } from '@testing-library/react'

import { Select } from '.'
import { randomPick } from 'src/shared/random'
import userEvent from '@testing-library/user-event'

const defaultOptions = [
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
]

const defaultProps = {
  label: 'Select Form Control',
  options: defaultOptions,
  isLoading: false,
}

it('should show a labelled select control', () => {
  const label = 'Test Select Label'
  render(<Select label={label} />)

  expect(screen.getByRole('combobox')).toHaveAccessibleName(label)
})

it('should allow uncontrolled behaviour', () => {
  render(<Select {...defaultProps} />)

  const selectControl = screen.getByRole('combobox')
  const optionToSelect = randomPick(defaultProps.options)

  userEvent.selectOptions(
    selectControl,
    screen.getByRole('option', { name: optionToSelect.label })
  )

  expect(selectControl).toHaveValue(optionToSelect.value)
  expect(selectControl).toBeValid()
})
it('should show loading state', () => {
  render(<Select {...defaultProps} isLoading />)

  // there should only be one option whn isLoading is true
  expect(screen.getByRole('option')).toHaveAccessibleName(/loading/i)
  expect(screen.getByRole('combobox')).toHaveValue('')
})

it('should render all options when not loading', () => {
  render(<Select {...defaultProps} />)

  const options = screen.getAllByRole('option')

  // we should have all the options, plus the empty one
  expect(options).toHaveLength(defaultProps.options.length + 1)

  defaultProps.options.forEach((option) => {
    expect(screen.getByRole('option', { name: option.label })).toHaveValue(
      option.value
    )
  })
})
it('shhould show error message if passed one', () => {
  const errorMessage = 'some error'
  render(<Select {...defaultProps} errorMessage={errorMessage} />)

  const selectControl = screen.getByRole('combobox')
  expect(selectControl).toBeInvalid()
  expect(selectControl).toHaveAccessibleDescription(errorMessage)
})
it('should have empty value to start with', () => {
  render(<Select {...defaultProps} />)

  const selectControl = screen.getByRole('combobox')
  expect(selectControl).toHaveDisplayValue('')
  expect(within(selectControl).getByRole('option', { name: '' })).toBeDisabled()
})
