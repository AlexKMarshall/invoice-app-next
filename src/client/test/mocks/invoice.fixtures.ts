import {
  NewDraftInvoiceInputDTO,
  NewPendingInvoiceInputDTO,
} from 'src/shared/dtos'
import { maybeUndefined, randomPick } from 'src/shared/random'

import { InvoiceDetail } from 'src/client/features/invoice/invoice.types'
import faker from 'faker'
import { generateId } from 'src/shared/identifier'

function buildMockInvoiceInput() {
  const itemsCount = faker.datatype.number({ min: 1, max: 3 })
  return {
    status: randomStatus(),
    senderAddress: {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      postcode: faker.address.zipCode(),
      country: faker.address.country(),
    },
    clientName: faker.name.findName(),
    clientEmail: faker.internet.email(),
    clientAddress: {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      postcode: faker.address.zipCode(),
      country: faker.address.country(),
    },
    issuedAt: faker.date.recent(),
    paymentTerms: faker.datatype.number({ max: 30 }),
    projectDescription: faker.commerce.productDescription(),
    itemList: new Array(itemsCount).fill(undefined).map(() => buildMockItem()),
  }
}

export function buildMockDraftInvoiceInput(): NewDraftInvoiceInputDTO {
  const itemsCount = faker.datatype.number({ min: 1, max: 3 })
  return {
    status: 'draft',
    senderAddress: {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      postcode: faker.address.zipCode(),
      country: faker.address.country(),
    },
    clientName: faker.name.findName(),
    clientEmail: faker.internet.email(),
    clientAddress: {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      postcode: faker.address.zipCode(),
      country: faker.address.country(),
    },
    issuedAt: faker.date.recent(),
    paymentTerms: faker.datatype.number({ max: 30 }),
    projectDescription: maybeUndefined(faker.commerce.productDescription()),
    itemList: new Array(itemsCount).fill(undefined).map(() => buildMockItem()),
  }
}

export function buildMockPendingInvoiceInput(): NewPendingInvoiceInputDTO {
  return { ...buildMockInvoiceInput(), status: 'pending' }
}

function randomStatus() {
  const statuses = ['draft', 'pending'] as const
  return randomPick(statuses)
}

function buildMockItem() {
  return {
    name: faker.commerce.product(),
    quantity: faker.datatype.number({ min: 1, max: 9 }),
    price: faker.datatype.number({ min: 100, max: 100000 }),
  }
}

export function buildMockInvoice(): InvoiceDetail {
  return {
    id: generateId(),
    ...buildMockInvoiceInput(),
  }
}

export function buildMockDraftInvoice(): InvoiceDetail {
  return {
    ...buildMockInvoice(),
    status: 'draft',
  }
}
