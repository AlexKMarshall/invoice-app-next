import * as invoiceModel from './invoice.model'

import { InvoiceDetail } from './invoice.types'
import { NewInvoiceInputDTO } from 'src/shared/dtos'
import { Client as PGClient } from 'pg'
import { execSync } from 'child_process'
import prisma from 'src/server/prisma'

type Props = {
  connectionString: string
}
export class Database {
  private connectionString: string
  constructor({ connectionString }: Props) {
    this.connectionString = connectionString
  }

  async dropSchema(schema: string): Promise<void> {
    const client = new PGClient({ connectionString: this.connectionString })
    await client.connect()
    await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
    await client.end()
  }

  seedInvoices(
    ...invoices: Array<NewInvoiceInputDTO>
  ): Promise<InvoiceDetail[]> {
    const savePromises = invoices.map((invoice) => invoiceModel.create(invoice))

    return Promise.all(savePromises)
  }

  migrate(): void {
    const command = `DATABASE_URL=${this.connectionString} npx prisma migrate deploy`
    execSync(command)
  }

  disconnect(): Promise<void> {
    return prisma.$disconnect()
  }
}
