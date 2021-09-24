import { Checkbox, CheckboxGroup } from './checkbox-group'
import { render, screen, within } from '@testing-library/react'

import { useState } from 'react'
import { userEvent } from 'src/client/test/test-utils'

afterEach(() => {
  jest.restoreAllMocks()
})

it('should render a group of checkboxes, defaulting to unchecked', () => {
  render(
    <CheckboxGroup label="pet">
      <Checkbox value="cat">Cat</Checkbox>
      <Checkbox value="dog">Dog</Checkbox>
    </CheckboxGroup>
  )

  const checkboxGroup = screen.getByRole('group', { name: /pet/i })
  expect(
    within(checkboxGroup).getByRole('checkbox', { name: /cat/i })
  ).not.toBeChecked()
  expect(
    within(checkboxGroup).getByRole('checkbox', { name: /dog/i })
  ).not.toBeChecked()
})
it('should be able to take a node as label', () => {
  render(
    <CheckboxGroup label={<h1>Shape</h1>}>
      <Checkbox value="circle">Circle</Checkbox>
      <Checkbox value="square">Square</Checkbox>
    </CheckboxGroup>
  )

  expect(screen.getByRole('group', { name: /shape/i })).toBeInTheDocument()
})
it('should allow selecting multiple options', () => {
  render(
    <CheckboxGroup label="pet">
      <Checkbox value="cat">Cat</Checkbox>
      <Checkbox value="dog">Dog</Checkbox>
    </CheckboxGroup>
  )

  const catBox = screen.getByRole('checkbox', { name: /cat/i })
  const dogBox = screen.getByRole('checkbox', { name: /dog/i })

  userEvent.click(catBox)
  expect(catBox).toBeChecked()
  expect(dogBox).not.toBeChecked()

  userEvent.click(dogBox)
  expect(catBox).toBeChecked()
  expect(dogBox).toBeChecked()

  userEvent.click(catBox)
  expect(catBox).not.toBeChecked()
  expect(dogBox).toBeChecked()
})
it('should be able to be controlled', async () => {
  function Component() {
    const [selectedItems, setSelectedItems] = useState<string[]>([])

    return (
      <>
        <CheckboxGroup
          label="pet"
          value={selectedItems}
          onChange={(newValue) => setSelectedItems(newValue)}
        >
          <Checkbox value="cat">Cat</Checkbox>
          <Checkbox value="dog">Dog</Checkbox>
        </CheckboxGroup>
        <ul>
          {selectedItems.map((item) => (
            <li key={item}>{item} - selected</li>
          ))}
        </ul>
      </>
    )
  }

  render(<Component />)

  expect(screen.queryByText(/cat - selected/i)).not.toBeInTheDocument()

  userEvent.click(screen.getByRole('checkbox', { name: /cat/i }))

  expect(screen.getByText(/cat - selected/i)).toBeInTheDocument()
})
it('should accept default values', () => {
  render(
    <CheckboxGroup label="pet" defaultValue={['cat']}>
      <Checkbox value="cat">Cat</Checkbox>
      <Checkbox value="dog">Dog</Checkbox>
    </CheckboxGroup>
  )

  expect(screen.getByRole('checkbox', { name: /cat/i })).toBeChecked()
  expect(screen.getByRole('checkbox', { name: /dog/i })).not.toBeChecked()
})
it('should throw if Checkbox used outside CheckboxGroup', () => {
  const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation()

  expect(() =>
    render(<Checkbox value="bad">Bad</Checkbox>)
  ).toThrowErrorMatchingInlineSnapshot(
    `"A <Checkbox> can only be used within a <CheckboxGroup> component"`
  )

  expect(consoleErrorMock).toHaveBeenCalled()

  consoleErrorMock.mockRestore()
})
