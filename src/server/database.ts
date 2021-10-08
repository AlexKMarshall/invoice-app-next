import { GetPaymentTermsResponse } from 'src/shared/dtos'
import { InvoiceDetail } from './features/invoice/invoice.types'
import { IterableElement } from 'type-fest'
import { Client as PGClient } from 'pg'
import { Prisma } from '@prisma/client'
import { execSync } from 'child_process'
import prisma from 'src/server/prisma'

type PaymentTerm = IterableElement<
  GetPaymentTermsResponse['data']['paymentTerms']
>

export type ReferenceDataStore = Record<'paymentTerms', PaymentTerm[]>

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

  createPaymentTerm(
    paymentTerm: Omit<PaymentTerm, 'id'>
  ): Promise<PaymentTerm> {
    return prisma.paymentTerm.create({
      data: paymentTerm,
      select: { id: true, value: true, name: true },
    })
  }

  seedPaymentTerms(
    ...paymentTerms: Array<Omit<PaymentTerm, 'id'>>
  ): Promise<PaymentTerm[]> {
    return Promise.all(
      paymentTerms.map((paymentTerm) => this.createPaymentTerm(paymentTerm))
    )
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
    paymentTerm: paymentTermDetail,
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

  const paymentTerm = {
    connect: {
      id: paymentTermDetail.id,
    },
  }

  const invoiceToSave = {
    id,
    status,
    issuedAt,
    paymentTerm,
    projectDescription,
    sender,
    client,
    invoiceItems,
  }

  return invoiceToSave
}
