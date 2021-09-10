import { IterableElement, Merge, PartialDeep } from 'type-fest'
import {
  NewDraftInvoiceInputDTO,
  NewInvoiceInputDTO,
  NewPendingInvoiceInputDTO,
} from 'src/shared/dtos'
import { maybeFactory, randomPick } from 'src/shared/random'

import { InvoiceDetail } from 'src/server/features/invoice/invoice.types'
import { add } from 'date-fns'
import faker from 'faker'
import { generateId } from 'src/shared/identifier'

function randomStatus() {
  return randomPick(['draft', 'pending'] as const)
}

export function buildMockPendingInvoiceInput(
  overrides: PartialDeep<NewPendingInvoiceInputDTO> = {}
): NewPendingInvoiceInputDTO {
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
    status: 'pending',
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

const maybeEmpty = maybeFactory(0.5, '')

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
      street: maybeEmpty(faker.address.streetAddress()),
      city: maybeEmpty(faker.address.city()),
      postcode: maybeEmpty(faker.address.zipCode()),
      country: maybeEmpty(faker.address.country()),
      ...overrideSenderAddress,
    },
    clientName: maybeEmpty(faker.name.findName()),
    clientEmail: maybeEmpty(faker.internet.email()),
    clientAddress: {
      street: maybeEmpty(faker.address.streetAddress()),
      city: maybeEmpty(faker.address.city()),
      postcode: maybeEmpty(faker.address.zipCode()),
      country: maybeEmpty(faker.address.country()),
      ...overrideClientAddress,
    },
    issuedAt,
    paymentTerms: faker.datatype.number({ max: 30 }),
    projectDescription: maybeEmpty(faker.commerce.productDescription()),
    itemList,
    ...otherOverrides,
  }
}

export function buildMockInvoiceInput(
  overrides: Merge<
    PartialDeep<NewPendingInvoiceInputDTO>,
    { status?: 'draft' | 'pending' }
  > = {}
): NewInvoiceInputDTO {
  const { status: overrideStatus, ...rest } = overrides

  const status = overrideStatus ?? randomStatus()

  if (status === 'draft') return buildMockDraftInvoiceInput(rest)
  if (status === 'pending') return buildMockPendingInvoiceInput(rest)
  else {
    const _exhaustiveCheck: never = status
    return _exhaustiveCheck
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

export function buildMockInvoiceDetail(
  overrides: PartialDeep<InvoiceDetail> = {}
): InvoiceDetail {
  const {
    senderAddress: overrideSenderAddress,
    clientAddress: overrideClientAddress,
    itemList: overrideItemList,
    issuedAt: overrideIssuedAt,
    paymentTerms: overridePaymentTerms,
    paymentDue: overridePaymentDue,
    ...otherOverrides
  } = overrides

  const itemList = buildMockItemList(overrideItemList)

  const issuedAt =
    overrideIssuedAt instanceof Date ? overrideIssuedAt : faker.date.recent()

  const paymentTerms =
    overridePaymentTerms ?? faker.datatype.number({ max: 30 })

  const paymentDue =
    overridePaymentDue instanceof Date
      ? overridePaymentDue
      : add(issuedAt, { days: paymentTerms })

  return {
    id: generateId(),
    status: 'pending',
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
    paymentTerms,
    paymentDue,
    projectDescription: faker.commerce.productDescription(),
    itemList,
    ...otherOverrides,
  }
}
