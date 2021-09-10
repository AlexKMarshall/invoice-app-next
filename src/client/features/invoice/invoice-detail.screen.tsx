import {
  Address as AddressType,
  InvoiceDetail,
} from 'src/client/features/invoice/invoice.types'
import { COLORS, TYPOGRAPHY } from 'src/client/shared/styles/theme'

import { Button } from 'src/client/shared/components/button'
import { StatusBadge } from 'src/client/shared/components/status-badge'
import { format } from 'date-fns'
import styled from 'styled-components'
import { useInvoiceDetail } from './invoice.queries'

type Props = {
  id: InvoiceDetail['id']
}

export function InvoiceDetailScreen({ id }: Props): JSX.Element {
  const invoiceDetailQuery = useInvoiceDetail(id)

  if (invoiceDetailQuery.isLoading) return <div>Loading...</div>
  if (invoiceDetailQuery.isSuccess) {
    const invoice = invoiceDetailQuery.data
    return (
      <>
        <StatusBar>
          <Status>
            Status
            <StatusBadge status={invoice.status} />
          </Status>
          <Button color="primary">Mark as Paid</Button>
        </StatusBar>
        <Details>
          <section>
            <h1>
              <InvoiceId>{invoice.id}</InvoiceId>
            </h1>
            <p>{invoice.projectDescription}</p>
          </section>
          <section>
            <h2>Sender Address</h2>
            <Address address={invoice.senderAddress} />
          </section>
          <section>
            <h2>Invoice Date</h2>
            <p>{format(invoice.issuedAt, 'dd MMM yyyy')}</p>
          </section>
          <section>
            <h2>Payment Due</h2>
            <p>{format(invoice.paymentDue, 'dd MMM yyyy')}</p>
          </section>
          <section>
            <h2>Bill To</h2>
            <p>{invoice.clientName}</p>
            <Address address={invoice.clientAddress} />
          </section>
          <section>
            <h2>Sent To</h2>
            <p>{invoice.clientEmail}</p>
          </section>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>QTY.</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.itemList.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Details>
      </>
    )
  }
  return <></>
}

const StatusBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  padding: 20px 32px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 10px -10px ${COLORS.shadowColor.prop};
`

const Status = styled.div`
  display: flex;
  align-items: baseline;
  gap: 16px;
`

const Details = styled.div``

const InvoiceId = styled.span`
  color: ${COLORS.textColor.strong.prop};
  font-weight: ${TYPOGRAPHY.fontWeight.bold.prop};
  font-size: ${TYPOGRAPHY.h3.fontSize.prop};
  text-decoration: none;

  &:before {
    content: '#';
    color: ${COLORS.textColor.prop};
  }
`

type AddressProps = {
  address: AddressType
}
function Address({ address }: AddressProps): JSX.Element {
  return (
    <p>
      <span>{address.street}</span>
      <br />
      <span>{address.city}</span>
      <br />
      <span>{address.postcode}</span>
      <br />
      <span>{address.country}</span>
    </p>
  )
}
