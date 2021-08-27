import { InvoiceSummary as DBInvoiceSummary } from '@prisma/client'
import { InvoiceSummary } from './invoice.types'
import prisma from 'src/server/prisma'

export async function seedInvoiceSummaries(
  ...invoices: Array<InvoiceSummary>
): Promise<DBInvoiceSummary[]> {
  await clearInvoiceSummaries()

  const savePromises = invoices.map((invoice) =>
    prisma.invoiceSummary.create({ data: invoice })
  )

  return Promise.all(savePromises)
}

function clearInvoiceSummaries() {
  return prisma.invoiceSummary.deleteMany()
}

export function disconnect(): Promise<void> {
  return prisma.$disconnect()
}
