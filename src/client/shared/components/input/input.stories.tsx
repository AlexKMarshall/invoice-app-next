import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Input } from './input'
import React from 'react'

export default {
  title: 'Input',
  component: Input,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Input>

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />

export const Primary = Template.bind({})
Primary.args = {
  label: 'Street Address',
  value: '19 Union Terrace',
}

export const WithError = Template.bind({})
WithError.args = {
  label: 'Street Address',
  value: '',
  errorMessage: "can't be empty",
}
