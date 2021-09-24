import { render, screen } from '@testing-library/react'

import { Input } from './input'
import { userEvent } from 'src/client/test/test-utils'

it('should have a labelled textbox', () => {
  const label = 'Test Label'

  render(<Input label={label} />)

  const inputField = screen.getByRole('textbox', { name: label })

  expect(inputField).toBeInTheDocument()

  const inputText = 'some text to type'
  userEvent.type(inputField, inputText)

  expect(inputField).toHaveValue(inputText)
  expect(inputField).toBeValid()
})

it('should be invalid if errorMessage prop is passed', () => {
  const label = 'Test Label'
  const errorMessage = 'Some error message'

  render(<Input label={label} errorMessage={errorMessage} />)

  const inputField = screen.getByRole('textbox', { name: label })

  expect(inputField).toBeInTheDocument()

  expect(inputField).toBeInvalid()
  expect(inputField).toHaveAccessibleDescription(errorMessage)
})
