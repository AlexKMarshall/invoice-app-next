import { Except, IterableElement, PartialDeep } from 'type-fest'
import {
  InvoiceDetail,
  InvoiceSummary,
} from 'src/server/features/invoice/invoice.types'

import { NewInvoiceInputDTO } from 'src/shared/dtos'
import faker from 'faker'
import { generateId } from 'src/shared/identifier'

function randomStatus() {
  const statuses = ['draft', 'pending'] as const
  const randomIndex = Math.floor(Math.random() * statuses.length)
  return statuses[randomIndex]
}

export function buildMockInvoiceSummary(): InvoiceSummary {
  return {
    id: generateId(),
    paymentDue: faker.date.soon(),
    clientName: faker.name.findName(),
    total: faker.datatype.number(),
    status: randomStatus(),
  }
}

export function buildMockInvoiceInput(
  overrides: PartialDeep<NewInvoiceInputDTO> = {}
): NewInvoiceInputDTO {
  const {
    senderAddress: overrideSenderAddress,
    clientAddress: overrideClientAddress,
    itemList: overrideItemList,
    issuedAt: overrideIssuedAt,
    ...otherOverrides
  } = overrides

  const itemList = buildMockItemList(overrideItemList)

  const issuedAt =
    overrideIssuedAt instanceof Date ? overrideIssuedAt : faker.date.recent()

  return {
    status: randomStatus(),
    senderAddress: {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      postcode: faker.address.zipCode(),
      country: faker.address.country(),
      ...overrideSenderAddress,
    },
    clientName: faker.name.findName(),
    clientEmail: faker.internet.email(),
    clientAddress: {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      postcode: faker.address.zipCode(),
      country: faker.address.country(),
      ...overrideClientAddress,
    },
    issuedAt,
    paymentTerms: faker.datatype.number({ max: 30 }),
    projectDescription: faker.commerce.productDescription(),
    itemList,
    ...otherOverrides,
  }
}

type ItemList = InvoiceDetail['itemList']
function buildMockItemList(overrides?: PartialDeep<ItemList>): ItemList {
  const randomLength = faker.datatype.number({ min: 1, max: 3 })

  const partialItems =
    overrides ?? Array.from({ length: randomLength }, () => undefined)

  return partialItems.map((override) => ({ ...buildMockItem(override) }))
}

type Item = IterableElement<ItemList>
function buildMockItem(overrides: PartialDeep<Item> = {}): Item {
  return {
    name: faker.commerce.product(),
    quantity: faker.datatype.number({ min: 1, max: 9 }),
    price: faker.datatype.number({ min: 100, max: 100000 }),
    ...overrides,
  }
}

type NewDraftInvoiceInputDTO = Except<NewInvoiceInputDTO, 'status'> & {
  status: 'draft'
}
export function buildMockDraftInvoiceInput(
  overrides?: PartialDeep<NewDraftInvoiceInputDTO>
): NewDraftInvoiceInputDTO {
  return { ...buildMockInvoiceInput(overrides), status: 'draft' }
}

export function buildMockInvoiceDetail(
  overrides: PartialDeep<InvoiceDetail> = {}
): InvoiceDetail {
  const { id: overrideId, ...otherOverrides } = overrides

  const id = overrideId ?? generateId()
  return {
    id,
    ...buildMockInvoiceInput(otherOverrides),
  }
}
