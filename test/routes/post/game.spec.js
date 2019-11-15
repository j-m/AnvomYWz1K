const request = require('supertest')

const app = require('../../../src/app/koa')
const ErrorEnum = require('../../../src/util/ErrorEnum')

const game = require('../../../src/models/game')
jest.mock('game')

beforeEach(() => {
  jest.resetModules()
})

describe('routes post game', () => {
  test('returns error from Game model', async done => {
    const response = await request(app.callback()).post('/game').send({ })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: false, code: ErrorEnum.GAME_TITLE_MISSING })
    done()
  })

  test('returns error from 3rd party', async done => {
    jest.doMock('../../../src/models/game', () => {
      return jest.fn(() => { throw new Error('unknown error') })
    })

    const response = await request(app.callback()).post('/game').send({ })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: false, message: 'unknown error' })
    done()
  })

  test('returns success', async done => {
    const response = await request(app.callback()).post('/game').send({ title: 'title', summary: 'summary', thumbnail: 'thumbnail' })
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toEqual({ success: true })
    done()
  })
})
