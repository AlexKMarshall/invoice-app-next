import 'src/client/shared/styles/global'
import 'src/client/shared/styles/reset.css'

import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Button } from './button'
import React from 'react'

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  children: 'Mark as Paid',
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  children: 'New Invoice',
  icon: 'plus',
}

export const WithPrefix = Template.bind({})
WithPrefix.args = {
  children: 'Add New Item',
  prefix: '+',
  color: 'muted',
}

export const Mono = Template.bind({})
Mono.args = {
  children: 'Save Draft',
  color: 'mono',
}
