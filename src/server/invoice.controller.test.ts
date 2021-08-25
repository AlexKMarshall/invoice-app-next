import * as invoiceController from './invoice.controller'

it('should get invoices', async () => {
  const result = await invoiceController.getInvoices()

  expect(result).toMatchObject({
    data: {
      invoices: expect.arrayContaining([
        expect.objectContaining({
          id: expect.stringMatching(/[A-Z]{2}\d{4}/),
          clientName: expect.any(String),
          paymentDue: expect.any(Date),
          status: expect.any(String),
          total: expect.any(Number),
        }),
      ]),
    },
  })
})
