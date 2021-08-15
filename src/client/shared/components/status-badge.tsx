import styled, { CSSProperties } from 'styled-components'

import { COLORS } from '../styles/colors'

const STATUS_COLORS = {
  draft: {
    opaque: COLORS.statusColor.draft.prop,
    faded: COLORS.statusColor.draft.faded.prop,
  },
  pending: {
    opaque: COLORS.statusColor.pending.prop,
    faded: COLORS.statusColor.pending.faded.prop,
  },
  paid: {
    opaque: COLORS.statusColor.paid.prop,
    faded: COLORS.statusColor.paid.faded.prop,
  },
}

type Props = {
  status: 'draft' | 'pending' | 'paid'
}
export function StatusBadge({ status }: Props): JSX.Element {
  const { opaque, faded } = STATUS_COLORS[status]

  return (
    <Wrapper
      style={
        { '--background-color': faded, '--color': opaque } as CSSProperties
      }
    >
      {status}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
  padding: 12px 18px 13px 18px;
  border-radius: 6px;
  background: var(--background-color);
  color: var(--color);
  font-weight: 700;
  text-transform: capitalize;

  &:before {
    --size: 0.5rem;
    content: '';
    width: var(--size);
    height: var(--size);
    margin-right: var(--size);
    border-radius: 50%;
    background-color: var(--color);
  }
`
