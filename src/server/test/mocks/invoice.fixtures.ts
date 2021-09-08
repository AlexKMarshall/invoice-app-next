import { IterableElement, Merge, PartialDeep } from 'type-fest'
import {
  NewDraftInvoiceInputDTO,
  NewPendingInvoiceInputDTO,
} from 'src/shared/dtos'
import { maybeUndefined, randomPick } from 'src/shared/random'

import { InvoiceDetail } from 'src/server/features/invoice/invoice.types'
import faker from 'faker'
import { generateId } from 'src/shared/identifier'

function randomStatus() {
  return randomPick(['draft', 'pending'] as const)
}

export function buildMockCompleteInvoiceInput(
  overrides: Merge<
    PartialDeep<NewPendingInvoiceInputDTO>,
    { status?: 'draft' | 'pending' }
  > = {}
): Merge<Required<NewPendingInvoiceInputDTO>, { status: 'draft' | 'pending' }> {
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

export function buildMockDraftInvoiceInput(
  overrides: PartialDeep<NewDraftInvoiceInputDTO> = {}
): NewDraftInvoiceInputDTO {
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
    status: 'draft',
    senderAddress: {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      postcode: faker.address.zipCode(),
      country: faker.address.country(),
      ...overrideSenderAddress,
    },
    clientName: maybeUndefined(faker.name.findName()),
    clientEmail: maybeUndefined(faker.internet.email()),
    clientAddress: {
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      postcode: faker.address.zipCode(),
      country: faker.address.country(),
      ...overrideClientAddress,
    },
    issuedAt,
    paymentTerms: faker.datatype.number({ max: 30 }),
    projectDescription: maybeUndefined(faker.commerce.productDescription()),
    itemList,
    ...otherOverrides,
  }
}

export function buildMockPendingInvoiceInput(
  overrides?: PartialDeep<NewPendingInvoiceInputDTO>
): NewPendingInvoiceInputDTO {
  return { ...buildMockCompleteInvoiceInput(overrides), status: 'pending' }
}

export function buildMockInvoiceDetail(
  overrides: PartialDeep<InvoiceDetail> = {}
): InvoiceDetail {
  const { id: overrideId, ...otherOverrides } = overrides

  const id = overrideId ?? generateId()
  return {
    id,
    ...buildMockCompleteInvoiceInput(otherOverrides),
  }
}
