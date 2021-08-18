import { ComponentMeta, ComponentStory } from '@storybook/react'

import React from 'react'
import { StatusBadge } from './status-badge'

export default {
  title: 'Example/StatusBadge',
  component: StatusBadge,
} as ComponentMeta<typeof StatusBadge>

const Template: ComponentStory<typeof StatusBadge> = (args) => (
  <StatusBadge {...args} />
)

export const Draft = Template.bind({})
Draft.args = {
  status: 'draft',
}
