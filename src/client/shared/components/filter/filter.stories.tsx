import { Checkbox, CheckboxGroup } from 'src/client/shared/components'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Filter } from './filter'
import { OverlayProvider } from '@react-aria/overlays'
import React from 'react'

export default {
  title: 'Filter',
  component: Filter,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Filter>

const Template: ComponentStory<typeof Filter> = (args) => (
  <OverlayProvider>
    <Filter {...args} />
  </OverlayProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  label: 'Filter by status',
  children: (
    <CheckboxGroup>
      <Checkbox value="cat">Cat</Checkbox>
      <Checkbox value="dog">Dog</Checkbox>
    </CheckboxGroup>
  ),
}
