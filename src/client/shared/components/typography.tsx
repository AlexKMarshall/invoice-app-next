import { COLORS, TYPOGRAPHY } from '../styles/theme'

import styled from 'styled-components'

export const Heading = styled.h1`
  font-weight: ${TYPOGRAPHY.fontWeight.bold.prop};
  font-size: ${32 / 16}rem;
  line-height: ${36 / 16}rem;
  letter-spacing: -1px;
  color: ${COLORS.textColor.strong.prop};
`
