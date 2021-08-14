import * as invoiceModel from './invoice.model'

import { buildMockDraftInvoice } from './invoice.fixtures'
import { handlers } from './handlers'
import { setupWorker } from 'msw'

const countSeededInvoices = Math.floor(Math.random() * 10)
const seededInvoices = new Array(countSeededInvoices)
  .fill(null)
  .map(() => buildMockDraftInvoice())

invoiceModel.initialise(seededInvoices)

export const worker = setupWorker(...handlers)
