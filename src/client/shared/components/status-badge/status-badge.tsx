import { statusBadge } from './status-badge.css'

type Props = {
  status: 'draft' | 'pending' | 'paid'
}
export function StatusBadge({ status }: Props): JSX.Element {
  return <div className={statusBadge({ status })}>{status}</div>
}
