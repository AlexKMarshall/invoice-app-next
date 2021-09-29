import { IterableElement, PartialDeep } from 'type-fest'
import {
  generateAlphanumericId,
  generateNumericId,
} from 'src/shared/identifier'
import { maybeEmpty, randomPick } from 'src/shared/random'

import { CreateInvoiceRequest } from 'src/shared/dtos'
import { InvoiceDetail } from 'src/server/features/invoice/invoice.types'
import { ReferenceDataStore } from 'src/server/database'
import { add } from 'date-fns'
import faker from 'faker'
import { round2dp } from 'src/shared/number'

function randomStatus() {
  return randomPick(['draft', 'pending', 'paid'] as const)
}

const emptyDataStore: ReferenceDataStore = {
  paymentTerms: [],
}

export function buildMockPendingInvoiceRequest(
  overrides: PartialDeep<CreateInvoiceRequest> = {},
  referenceDataStore: ReferenceDataStore = emptyDataStore
): CreateInvoiceRequest {
  const {
    senderAddress: overrideSenderAddress,
    clientAddress: overrideClientAddress,
    itemList: overrideItemList,
    issuedAt: overrideIssuedAt,
    ...otherOverrides
  } = overrides

  const itemList = buildMockItemList(overrideItemList)

  const issuedAt =
    overrideIssuedAt instanceof Date ? overrideIssuedAt : faker.date.recent(90)

  const paymentTermId =
    referenceDataStore.paymentTerms.length > 0
      ? randomPick(referenceDataStore.paymentTerms).id
      : undefined

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
    paymentTermId,
    projectDescription: faker.commerce.productDescription(),
    itemList,
    ...otherOverrides,
  }
}

export function buildMockDraftInvoiceRequest(
  overrides: PartialDeep<CreateInvoiceRequest> = {},
  referenceDataStore: ReferenceDataStore = emptyDataStore
): CreateInvoiceRequest {
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

  const paymentTermId =
    referenceDataStore.paymentTerms.length > 0
      ? randomPick(referenceDataStore.paymentTerms).id
      : undefined

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
    paymentTermId: paymentTermId,
    projectDescription: maybeEmpty(faker.commerce.productDescription()),
    itemList,
    ...otherOverrides,
  }
}

export function buildMockInvoiceRequest(
  overrides: PartialDeep<CreateInvoiceRequest> = {},
  referenceDataStore: ReferenceDataStore = emptyDataStore
): CreateInvoiceRequest {
  const { status: overrideStatus, ...rest } = overrides

  const status = overrideStatus ?? randomPick(['draft', 'pending'])

  if (status === 'draft')
    return buildMockDraftInvoiceRequest(rest, referenceDataStore)
  if (status === 'pending')
    return buildMockPendingInvoiceRequest(rest, referenceDataStore)
  else {
    const _exhaustiveCheck: never = status
    return _exhaustiveCheck
  }
}

type NewItemListInput = CreateInvoiceRequest['itemList']
function buildMockItemList(
  overrides?: PartialDeep<NewItemListInput>
): NewItemListInput {
  const randomLength = faker.datatype.number({ min: 1, max: 3 })

  const partialItems =
    overrides ?? Array.from({ length: randomLength }, () => undefined)

  return partialItems.map((override) => ({ ...buildMockItem(override) }))
}

type NewItemInput = IterableElement<NewItemListInput>
function buildMockItem(
  overrides: PartialDeep<NewItemInput> = {}
): NewItemInput {
  return {
    name: faker.commerce.product(),
    quantity: faker.datatype.number({ min: 1, max: 9 }),
    price: faker.datatype.number({ min: 0, max: 10000, precision: 2 }),
    ...overrides,
  }
}

export function buildMockInvoiceDetail(
  overrides: PartialDeep<InvoiceDetail> = {},
  referenceDataStore: ReferenceDataStore = emptyDataStore
): InvoiceDetail {
  const { status: overrideStatus, ...rest } = overrides

  const status = overrideStatus ?? randomStatus()

  let input: CreateInvoiceRequest
  if (status === 'draft') {
    input = buildMockDraftInvoiceRequest(rest, referenceDataStore)
  } else if (status === 'pending') {
    input = buildMockPendingInvoiceRequest(rest, referenceDataStore)
  } else if (status === 'paid') {
    input = buildMockPendingInvoiceRequest(rest, referenceDataStore)
  } else {
    const _exhaustiveCheck: never = status
    return _exhaustiveCheck
  }

  return {
    ...invoiceDetailFromRequest(
      input,
      generateAlphanumericId(),
      referenceDataStore
    ),
    status: input.status,
  }
}

export function invoiceDetailFromRequest(
  { paymentTermId, ...input }: CreateInvoiceRequest,
  invoiceId: InvoiceDetail['id'],
  referenceDataStore: ReferenceDataStore
): InvoiceDetail {
  let paymentTermValue = input.paymentTerms
  let paymentTerm: { id: number; value: number; name: string } | undefined

  if (paymentTermId !== undefined) {
    paymentTerm = referenceDataStore.paymentTerms.find(
      (pt) => pt.id === paymentTermId
    )
    if (paymentTerm) {
      paymentTermValue = paymentTerm.value
    }
  }

  return {
    ...input,
    paymentDue: add(input.issuedAt, { days: paymentTermValue }),
    paymentTerm,
    id: invoiceId,
    itemList: input.itemList.map((itemInput) => ({
      ...itemInput,
      id: generateNumericId(),
      total: itemInput.quantity * itemInput.price,
    })),
    amountDue: round2dp(
      input.itemList.reduce(
        (acc, { quantity, price }) =>
          round2dp(acc + round2dp(quantity * price)),
        0
      )
    ),
  }
}
