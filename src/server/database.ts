import { InvoiceDetail } from './features/invoice/invoice.types'
import { Client as PGClient } from 'pg'
import { Prisma } from '@prisma/client'
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

  createInvoice(invoice: InvoiceDetail): Promise<unknown> {
    const preparedInvoice = prepareInvoiceToCreate(invoice)
    return prisma.invoice.create({ data: preparedInvoice })
  }

  seedInvoices(...invoices: Array<InvoiceDetail>): Promise<unknown> {
    const savePromises = invoices.map((invoice) => this.createInvoice(invoice))

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

function prepareInvoiceToCreate(
  invoice: InvoiceDetail
): Prisma.InvoiceCreateInput {
  const {
    id,
    status,
    issuedAt,
    paymentTerms,
    projectDescription,
    clientName,
    clientEmail,
    clientAddress,
    senderAddress,
    itemList,
  } = invoice
  const sender: Prisma.SenderCreateNestedOneWithoutInvoiceInput = {
    create: {
      address: {
        create: senderAddress,
      },
    },
  }

  const client: Prisma.ClientCreateNestedOneWithoutInvoiceInput = {
    create: {
      name: clientName,
      email: clientEmail,
      address: {
        create: clientAddress,
      },
    },
  }

  const invoiceItems: Prisma.InvoiceItemCreateNestedManyWithoutInvoiceInput = {
    create: itemList.map((itemInput) => ({
      quantity: itemInput.quantity,
      item: {
        create: {
          name: itemInput.name,
          price: itemInput.price,
        },
      },
    })),
  }

  const invoiceToSave = {
    id,
    status,
    issuedAt,
    paymentTerms,
    projectDescription,
    sender,
    client,
    invoiceItems,
  }

  return invoiceToSave
}
