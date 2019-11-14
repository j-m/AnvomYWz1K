const validateUsername = require('../../../../src/routes/post/util/validateUsername')
const connection = require('../../../../src/database/connection')
const ErrorEnum = require('../../../../src/util/ErrorEnum')

beforeAll(async () => {
  jest.resetModules()
  process.env.DATABASE = ':memory:'
  await connection.open()
  await connection.run('insert.member', 'test@test.test', 'real', '$2a$12$mRK3BPWwiklKSgj9HozTuuCtKi0icbiHHkX2ruBcmSdhNVuykgNnG')
})

afterAll(async () => {
  await connection.run('delete.memberByUsername', 'real')
  await connection.close()
})

describe('routes post util validateUsername', () => {
  test('requires username', async () => {
    await expect(validateUsername()).rejects.toThrow(ErrorEnum.USERNAME_MISSING)
  })

  test('username cannot start with -', async () => {
    await expect(validateUsername('-bad')).rejects.toThrow(ErrorEnum.USERNAME_BAD_REGEX)
  })

  test('username cannot end with -', async () => {
    await expect(validateUsername('bad-')).rejects.toThrow(ErrorEnum.USERNAME_BAD_REGEX)
  })

  test('username can contain -', async () => {
    await expect(validateUsername('go-d')).resolves
  })

  test('username is not in use', async () => {
    await expect(validateUsername('real')).rejects.toThrow(ErrorEnum.USERNAME_IN_USE)
  })

  test('does not throw if username not in use and valid', async () => {
    await expect(validateUsername('unique')).resolves
  })
})
