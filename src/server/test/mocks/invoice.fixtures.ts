import { NewInvoiceInputDTO } from 'src/shared/dtos'
import faker from 'faker'
import { generateInvoiceId } from 'src/client/shared/utils'

function randomStatus() {
  const statuses = ['draft', 'pending', 'paid'] as const
  const randomIndex = Math.floor(Math.random() * statuses.length)
  return statuses[randomIndex]
}

type InvoiceSummary = {
  id: string
  paymentDue: Date
  clientName: string
  total: number
  status: 'draft' | 'pending' | 'paid'
}

export function buildMockInvoiceSummary(): InvoiceSummary {
  return {
    id: generateInvoiceId(),
    paymentDue: faker.date.soon(),
    clientName: faker.name.findName(),
    total: faker.datatype.number(),
    status: randomStatus(),
  }
}

export function buildMockInvoiceInput(): NewInvoiceInputDTO {
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

function buildMockItem() {
  return {
    name: faker.commerce.product(),
    quantity: faker.datatype.number({ min: 1, max: 9 }),
    price: faker.datatype.number({ min: 100, max: 100000 }),
  }
}

export function buildMockDraftInvoiceInput(): NewInvoiceInputDTO {
  return { ...buildMockInvoiceInput(), status: 'draft' }
}
