import * as invoiceModel from './invoice.model'

import { buildMockInvoiceDetail } from './invoice.fixtures'
import { handlers } from './handlers'
import { setupWorker } from 'msw'

const countSeededInvoices = Math.floor(Math.random() * 10)
const seededInvoices = new Array(countSeededInvoices)
  .fill(null)
  .map(() => buildMockInvoiceDetail())

invoiceModel.initialise(seededInvoices)

export const worker = setupWorker(...handlers)
