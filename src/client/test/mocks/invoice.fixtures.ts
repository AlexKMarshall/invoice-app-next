import { IterableElement, PartialDeep } from 'type-fest'
import { maybeEmpty, randomPick } from 'src/shared/random'

import { InvoiceDetail } from 'src/client/features/invoice/invoice.types'
import { NewInvoiceInputDTO } from 'src/shared/dtos'
import faker from 'faker'
import { generateId } from 'src/shared/identifier'
import { invoiceDetailFromInput } from 'src/client/features/invoice/invoice.mappers'

export function buildMockPendingInvoiceInput(
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
    paymentTerms: faker.datatype.number({ min: 1, max: 30 }),
    projectDescription: faker.commerce.productDescription(),
    itemList,
    ...otherOverrides,
  }
}

export function buildMockDraftInvoiceInput(
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
    paymentTerms: faker.datatype.number({ min: 1, max: 30 }),
    projectDescription: maybeEmpty(faker.commerce.productDescription()),
    itemList,
    ...otherOverrides,
  }
}

export function buildMockInvoiceInput(
  overrides: PartialDeep<NewInvoiceInputDTO> = {}
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
  const { status: overrideStatus, ...rest } = overrides

  const status = overrideStatus ?? randomStatus()

  let input: NewInvoiceInputDTO
  if (status === 'draft') {
    input = buildMockDraftInvoiceInput(rest)
  } else if (status === 'pending') {
    input = buildMockPendingInvoiceInput(rest)
  } else {
    const _exhaustiveCheck: never = status
    return _exhaustiveCheck
  }

  return invoiceDetailFromInput(input, generateId())
}

function randomStatus() {
  const statuses = ['draft', 'pending'] as const
  return randomPick(statuses)
}
