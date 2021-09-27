import { Checkbox, CheckboxGroup } from './checkbox-group'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import React from 'react'

export default {
  title: 'CheckboxGroup',
  component: CheckboxGroup,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof CheckboxGroup>

const Template: ComponentStory<typeof CheckboxGroup> = (args) => (
  <CheckboxGroup {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
  children: (
    <>
      <Checkbox value="draft">Draft</Checkbox>
      <Checkbox value="pending">Pending</Checkbox>
      <Checkbox value="paid">Paid</Checkbox>
    </>
  ),
  value: ['draft', 'paid'],
}
