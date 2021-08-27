import { buildMockInvoiceDetail } from 'src/server/test/mocks/invoice.fixtures'
import { invoiceDetailToSummary } from './invoice.mappers'

it('should map an invoice detail to an invoice summary', () => {
  const issuedAt = new Date('2021-08-27')
  const paymentTerms = 2
  const expectedPaymentDue = new Date('2021-08-29')

  const itemList = [
    { quantity: 2, price: 5 },
    { quantity: 1, price: 7 },
  ]
  const expectedTotal = 2 * 5 + 1 * 7

  const invoiceDetail = buildMockInvoiceDetail({
    issuedAt,
    paymentTerms,
    itemList,
  })

  const result = invoiceDetailToSummary(invoiceDetail)

  expect(result).toEqual({
    id: invoiceDetail.id,
    paymentDue: expectedPaymentDue,
    clientName: invoiceDetail.clientName,
    status: invoiceDetail.status,
    total: expectedTotal,
  })
})
