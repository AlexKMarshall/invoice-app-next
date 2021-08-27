import { InvoiceSummary as DBInvoiceSummary } from '@prisma/client'
import { InvoiceSummary } from './invoice.types'
import prisma from 'src/server/prisma'

export async function seedInvoices(
  ...invoices: Array<InvoiceSummary>
): Promise<DBInvoiceSummary[]> {
  await clearInvoices()

  const savePromises = invoices.map((invoice) =>
    prisma.invoiceSummary.create({ data: invoice })
  )

  return Promise.all(savePromises)
}

function clearInvoices() {
  return prisma.invoiceSummary.deleteMany()
}

export function connect(): Promise<void> {
  return prisma.$connect()
}

export function disconnect(): Promise<void> {
  return prisma.$disconnect()
}
