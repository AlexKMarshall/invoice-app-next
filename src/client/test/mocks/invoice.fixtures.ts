import { InvoiceDetail } from 'src/client/features/invoice/invoice.types'
import { NewInvoiceInputDTO } from 'src/shared/dtos'
import faker from 'faker'
import { generateInvoiceId } from 'src/client/shared/utils'

export function buildMockInvoiceInput(): NewInvoiceInputDTO {
  const itemsCount = faker.datatype.number({ min: 1, max: 3 })
  return {
    status: pickRandomStatus(),
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

export function buildMockDraftInvoiceInput(): NewInvoiceInputDTO {
  return { ...buildMockInvoiceInput(), status: 'draft' }
}

export function buildMockPendingInvoiceInput(): NewInvoiceInputDTO {
  return { ...buildMockInvoiceInput(), status: 'pending' }
}

function pickRandomStatus() {
  const statuses = ['draft', 'pending', 'paid'] as const
  const randomIndex = Math.floor(Math.random() * statuses.length)
  return statuses[randomIndex]
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
    id: generateInvoiceId(),
    ...buildMockInvoiceInput(),
  }
}

export function buildMockDraftInvoice(): InvoiceDetail {
  return {
    ...buildMockInvoice(),
    status: 'draft',
  }
}
