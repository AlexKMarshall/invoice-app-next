import { GetInvoiceSummary } from 'src/shared/dtos'
import { IterableElement } from 'msw/node_modules/type-fest'

type InvoiceSummary = IterableElement<GetInvoiceSummary['data']['invoices']>

type Store = {
  invoices: Array<InvoiceSummary>
}

const store: Store = { invoices: [] }

export function findAll(): Promise<Array<InvoiceSummary>> {
  return Promise.resolve(store.invoices)
}

export function initialise(invoices: Array<InvoiceSummary>): void {
  store.invoices = invoices
}
