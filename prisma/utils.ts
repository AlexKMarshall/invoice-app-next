import * as fs from 'fs/promises'

import path from 'path'

export function deleteDatabase(dbName: string): Promise<void[]> {
  const dbFileName = path.join(__dirname, `${dbName}.db`)

  const deleteDb = fs.unlink(dbFileName)
  return Promise.all([deleteDb])
}
