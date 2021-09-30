import { ComponentMeta, ComponentStory } from '@storybook/react'

import React from 'react'
import { Select } from './select'

export default {
  title: 'Select',
  component: Select,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Select>

const Template: ComponentStory<typeof Select> = (args) => <Select {...args} />

export const Loading = Template.bind({})
Loading.args = {
  isLoading: true,
}

export const WithOptions = Template.bind({})
WithOptions.args = {
  label: 'Favourite Pet',
  isLoading: false,
  options: [
    { value: 'cat', label: 'Cat' },
    { value: 'dog', label: 'Dog' },
  ],
}

export const WithError = Template.bind({})
WithError.args = {
  label: 'Favourite Pet',
  errorMessage: 'Oh no',
  isLoading: false,
  options: [
    { value: 'cat', label: 'Cat' },
    { value: 'dog', label: 'Dog' },
  ],
}
