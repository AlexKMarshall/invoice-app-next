import {
  Address as AddressType,
  InvoiceDetail,
} from 'src/client/features/invoice/invoice.types'
import { COLORS, TYPOGRAPHY } from 'src/client/shared/styles/theme'
import styled, { CSSProperties } from 'styled-components'

import { Button } from 'src/client/shared/components/button'
import { StatusBadge } from 'src/client/shared/components/status-badge'
import { format } from 'date-fns'
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
          <Grid>
            <section>
              <h1>
                <InvoiceId>{invoice.id}</InvoiceId>
              </h1>
              <p>{invoice.projectDescription}</p>
            </section>
            <section>
              <Address address={invoice.senderAddress} align="right" />
            </section>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <section>
                <SectionHeader>Invoice Date</SectionHeader>
                <PrimaryValue>
                  {format(invoice.issuedAt, 'dd MMM yyyy')}
                </PrimaryValue>
              </section>
              <section>
                <SectionHeader>Payment Due</SectionHeader>
                <PrimaryValue>
                  {format(invoice.paymentDue, 'dd MMM yyyy')}
                </PrimaryValue>
              </section>
            </div>
            <section>
              <SectionHeader>Bill To</SectionHeader>
              <PrimaryValue style={{ marginBottom: '8px' }}>
                {invoice.clientName}
              </PrimaryValue>
              <Address address={invoice.clientAddress} />
            </section>
            <section>
              <SectionHeader>Sent To</SectionHeader>
              <PrimaryValue>{invoice.clientEmail}</PrimaryValue>
            </section>
          </Grid>
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
            <tfoot>
              <tr>
                <th scope="row">Amount Due</th>
                <td>{invoice.amountDue}</td>
              </tr>
            </tfoot>
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
  margin-top: 32px;
  margin-bottom: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 10px -10px ${COLORS.shadowColor.prop};
`

const Status = styled.div`
  display: flex;
  align-items: baseline;
  gap: 16px;
`

const Details = styled.div`
  padding: 48px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 10px -10px ${COLORS.shadowColor.prop};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 21px;
  margin-bottom: 45px;

  & > :first-child {
    grid-column: span 2;
  }
`

const InvoiceId = styled.span`
  color: ${COLORS.textColor.strong.prop};
  font-weight: ${TYPOGRAPHY.fontWeight.bold.prop};
  font-size: ${TYPOGRAPHY.h3.fontSize.prop};
  text-decoration: none;
  margin-bottom: 8px;

  &:before {
    content: '#';
    color: ${COLORS.textColor.prop};
  }
`

type AddressProps = {
  address: AddressType
  align?: 'left' | 'right'
}
function Address({ address, align = 'left' }: AddressProps): JSX.Element {
  return (
    <AddressWrapper style={{ '--text-align': align } as CSSProperties}>
      <span>{address.street}</span>
      <br />
      <span>{address.city}</span>
      <br />
      <span>{address.postcode}</span>
      <br />
      <span>{address.country}</span>
    </AddressWrapper>
  )
}

const AddressWrapper = styled.p`
  text-align: var(--text-align);
  font-size: ${TYPOGRAPHY.body2.fontSize.prop};
  line-height: ${TYPOGRAPHY.body2.lineHeight.prop};
  letter-spacing: ${TYPOGRAPHY.body2.letterSpacing.prop};
`

const SectionHeader = styled.h2`
  font-size: ${TYPOGRAPHY.body1.fontSize.prop};
  letter-spacing: ${TYPOGRAPHY.body1.letterSpacing.prop};
  font-weight: ${TYPOGRAPHY.fontWeight.normal.prop};
  margin-bottom: 12px;
`

const PrimaryValue = styled.p`
  font-size: 15px;
  line-height: 20px;
  letter-spacing: -0.31px;
  color: ${COLORS.textColor.strong.prop};
  font-weight: ${TYPOGRAPHY.fontWeight.bold.prop};
`
