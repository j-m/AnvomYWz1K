const esmRequire = require('esm')(module)
const database = esmRequire('../src/database.mjs')

let originalDatabaseName

beforeEach(async () => {
  originalDatabaseName = process.env.DATABASE
  process.env.DATABASE = ':memory:'
})

beforeAll(async () => {
  await database.open()
})

afterEach(async () => {
  process.env.DATABASE = originalDatabaseName
})

afterAll(async () => {
  await database.close()
})

describe('database', () => {
  test('should create a table', async done => {
    database.createTable()
    database.addRowToTable()
    expect(database.getTableRows()).toBe(1)
    done()
  })
})
