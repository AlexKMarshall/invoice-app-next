import { Invoice } from '@prisma/client'
import { InvoiceSummary } from './invoice.types'
import prisma from 'src/server/prisma'

export async function seedInvoices(
  ...invoices: Array<InvoiceSummary>
): Promise<Invoice[]> {
  await clearInvoices()

  const savePromises = invoices.map((invoice) =>
    prisma.invoice.create({ data: invoice })
  )

  return Promise.all(savePromises)
}

function clearInvoices() {
  return prisma.invoice.deleteMany()
}

export function connect(): Promise<void> {
  return prisma.$connect()
}

export function disconnect(): Promise<void> {
  return prisma.$disconnect()
}
