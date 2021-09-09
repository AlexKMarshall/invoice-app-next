import { InvoiceDetailScreen } from 'src/client/features/invoice/invoice-detail.screen'
import { useRouter } from 'next/router'

export default function InvoiceDetail(): JSX.Element {
  const {
    query: { id },
  } = useRouter()

  if (typeof id !== 'string') return <></>
  return <InvoiceDetailScreen id={id} />
}
