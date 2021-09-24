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

export const Primary = Template.bind({})
Primary.args = {}
