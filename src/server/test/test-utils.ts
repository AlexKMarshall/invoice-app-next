import { Database } from '../database'
import { PaymentTerm } from '.prisma/client'

let database: Database

type ReferenceDataStore = Record<'paymentTerms', PaymentTerm[]>

function prepareDbForTests(): ReferenceDataStore {
  let schema: string
  let connectionString: string

  const referenceDataStore: ReferenceDataStore = { paymentTerms: [] }

  beforeEach(async () => {
    schema = `test-${process.env.JEST_WORKER_ID}`
    if (!process.env.DATABASE_URL)
      throw new Error('Missing environment variable DATABASE_URL')
    const [connStringNoSchema] = process.env.DATABASE_URL.split('?')
    connectionString = `${connStringNoSchema}?schema=${schema}`
    process.env.DATABASE_URL = connectionString

    database = new Database({ connectionString })

    await database.dropSchema(schema)
    database.migrate()

    await populateDB(database, referenceDataStore)
  })

  afterEach(async () => {
    await database.dropSchema(schema)
    await database.disconnect()
  })

  return referenceDataStore
}

async function populateDB(
  database: Database,
  referenceDataStore: ReferenceDataStore
) {
  const paymentTerms = await database.seedPaymentTerms(
    { value: 1, name: 'Net 1 Day' },
    { value: 7, name: 'Net 7 Days' },
    { value: 14, name: 'Net 14 Days' },
    { value: 30, name: 'Net 30 Days' },
    { value: 90, name: 'Net 90 Days' }
  )

  referenceDataStore.paymentTerms = paymentTerms
}

export { prepareDbForTests, database }
