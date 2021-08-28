import { Database } from '../database'

let database: Database

function prepareDbForTests(): void {
  let schema: string
  let connectionString: string

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
  })

  afterEach(async () => {
    await database.dropSchema(schema)
    await database.disconnect()
  })
}

export { prepareDbForTests, database }
