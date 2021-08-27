import * as invoiceModel from './invoice.model'

import { InvoiceDetail } from './invoice.types'
import { NewInvoiceInputDTO } from 'src/shared/dtos'
import prisma from 'src/server/prisma'

export function seedInvoices(
  ...invoices: Array<NewInvoiceInputDTO>
): Promise<InvoiceDetail[]> {
  const savePromises = invoices.map((invoice) => invoiceModel.create(invoice))

  return Promise.all(savePromises)
}

export function disconnect(): Promise<void> {
  return prisma.$disconnect()
}
