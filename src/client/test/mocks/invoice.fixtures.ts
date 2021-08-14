import { InvoiceDetail } from 'src/client/features/invoice/invoice.types'
import { NewInvoiceInputDTO } from 'src/shared/dtos'
import faker from 'faker'
import { generateInvoiceId } from 'src/client/shared/utils'

export function buildMockDraftInvoiceInput(): NewInvoiceInputDTO {
  const itemsCount = faker.datatype.number({ min: 2, max: 3 })
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
    projectDescription: faker.commerce.productDescription(),
    itemList: new Array(itemsCount)
      .fill(undefined)
      .map(() => buildMockDraftItem()),
  }
}

function buildMockDraftItem() {
  return {
    name: faker.commerce.product(),
    quantity: faker.datatype.number(),
    price: faker.datatype.number(),
  }
}

export function buildMockDraftInvoice(): InvoiceDetail {
  return {
    id: generateInvoiceId(),
    ...buildMockDraftInvoiceInput(),
  }
}
