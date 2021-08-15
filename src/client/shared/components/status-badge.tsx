import styled, { CSSProperties } from 'styled-components'

const STATUS_HSL = {
  draft: '231deg, 20%, 27%',
  pending: '34deg, 100%, 50%',
  paid: '160deg, 67%, 52%',
}

type Props = {
  status: 'draft' | 'pending' | 'paid'
}
export function StatusBadge({ status }: Props): JSX.Element {
  const hsl = STATUS_HSL[status]

  return <Wrapper style={{ '--hsl': hsl } as CSSProperties}>{status}</Wrapper>
}

const Wrapper = styled.div`
  --hsl: 231deg, 20%, 27%;
  --background-alpha: 0.06;
  --color-alpha: 1;
  --background-color: hsla(var(--hsl), var(--background-alpha));
  --color: hsla(var(--hsl), var(--color-alpha));

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
