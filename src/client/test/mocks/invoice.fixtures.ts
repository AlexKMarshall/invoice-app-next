import { IterableElement, PartialDeep } from 'type-fest'
import { maybeEmpty, randomPick } from 'src/shared/random'

import { CreateInvoiceRequest } from 'src/shared/dtos'
import { InvoiceDetail } from 'src/client/features/invoice/invoice.types'
import { PaymentTerm } from 'src/client/features/invoice/payment-term.types'
import faker from 'faker'
import { generateAlphanumericId } from 'src/shared/identifier'
import { invoiceMapperFactory } from 'src/client/features/invoice/invoice.mappers'

type ReferenceDataStore = {
  paymentTerms: PaymentTerm[]
}

const emptyReferenceData = {
  paymentTerms: [],
}

export function invoiceFixturesFactory(
  referenceDataStore: ReferenceDataStore = emptyReferenceData
) {
  const { invoiceDetailFromInput } = invoiceMapperFactory(referenceDataStore)

  function buildMockPendingInvoiceInput(
    overrides: PartialDeep<CreateInvoiceRequest> = {}
  ): CreateInvoiceRequest & { paymentTerm?: PaymentTerm } {
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

    const paymentTerm = randomPick(referenceDataStore.paymentTerms)

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
      paymentTermId: paymentTerm?.id,
      paymentTerm,
      projectDescription: faker.commerce.productDescription(),
      itemList,
      ...otherOverrides,
    }
  }

  function buildMockDraftInvoiceInput(
    overrides: PartialDeep<CreateInvoiceRequest> = {}
  ): CreateInvoiceRequest & { paymentTerm?: PaymentTerm } {
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

    const paymentTerm = randomPick(referenceDataStore.paymentTerms)

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
      paymentTermId: paymentTerm?.id,
      paymentTerm,
      projectDescription: maybeEmpty(faker.commerce.productDescription()),
      itemList,
      ...otherOverrides,
    }
  }

  function buildMockInvoiceInput(
    overrides: PartialDeep<CreateInvoiceRequest> = {}
  ): CreateInvoiceRequest {
    const { status: overrideStatus, ...rest } = overrides

    const status = overrideStatus ?? randomPick(['draft', 'pending'])

    if (status === 'draft') return buildMockDraftInvoiceInput(rest)
    if (status === 'pending') return buildMockPendingInvoiceInput(rest)
    else {
      const _exhaustiveCheck: never = status
      return _exhaustiveCheck
    }
  }

  function buildMockInvoiceDetail(
    overrides: PartialDeep<InvoiceDetail> = {}
  ): InvoiceDetail {
    const { status: overrideStatus, ...rest } = overrides

    const status = overrideStatus ?? randomStatus()

    let input: CreateInvoiceRequest
    if (status === 'draft') {
      input = buildMockDraftInvoiceInput(rest)
    } else if (status === 'pending') {
      input = buildMockPendingInvoiceInput(rest)
    } else if (status === 'paid') {
      input = buildMockPendingInvoiceInput(rest)
    } else {
      const _exhaustiveCheck: never = status
      return _exhaustiveCheck
    }

    return {
      ...invoiceDetailFromInput(input, generateAlphanumericId()),
      status: status,
    }
  }

  return {
    buildMockInvoiceDetail,
    buildMockPendingInvoiceInput,
    buildMockDraftInvoiceInput,
    buildMockInvoiceInput,
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
    price: faker.datatype.number({ min: 100, max: 100000 }),
    ...overrides,
  }
}

function randomStatus() {
  const statuses = ['draft', 'pending', 'paid'] as const
  return randomPick(statuses)
}
