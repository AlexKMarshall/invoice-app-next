import * as invoiceModel from './invoice.model'

import { handlers } from './handlers'
import { invoiceFixturesFactory } from './invoice.fixtures'
import { setupWorker } from 'msw'

const { buildMockInvoiceDetail } = invoiceFixturesFactory()

const countSeededInvoices = Math.floor(Math.random() * 10)
const seededInvoices = new Array(countSeededInvoices)
  .fill(null)
  .map(() => buildMockInvoiceDetail())

invoiceModel.initialise(seededInvoices)

export const worker = setupWorker(...handlers)
