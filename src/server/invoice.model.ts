import { NewInvoiceInputDTO, NewInvoiceReturnDTO } from 'src/shared/dtos'

import { InvoiceSummary } from './invoice.types'
import { generateInvoiceId } from 'src/client/shared/utils'
import prisma from 'src/server/prisma'

function includes<T extends U, U>(coll: ReadonlyArray<T>, el: U): el is T {
  return coll.includes(el as T)
}

function exists<T>(item: T | undefined | null): item is T {
  return item !== undefined && item !== null
}

export function findAll(): Promise<Array<InvoiceSummary>> {
  return prisma.invoice.findMany().then((rawInvoices) =>
    rawInvoices
      .map((rawInvoice) => {
        const validStatuses = ['draft', 'pending', 'paid'] as const
        if (includes(validStatuses, rawInvoice.status)) {
          return rawInvoice as InvoiceSummary
        }
        return null
      })
      .filter(exists)
  )
}

export function create(
  newInvoice: NewInvoiceInputDTO
): Promise<NewInvoiceReturnDTO['data']['savedInvoice']> {
  const id = generateInvoiceId()

  const savedInvoice = { ...newInvoice, id }

  return Promise.resolve(savedInvoice)
}
