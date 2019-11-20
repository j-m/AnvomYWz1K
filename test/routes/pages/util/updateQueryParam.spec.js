'use strict'

const updateQueryParam = require('../../../../src/routes/pages/util/updateQueryParam')

describe('routes pages util updateQueryParam', () => {
  test('adds ? if required', async done => {
    const href = 'www.example.com/some/directory'
    const result = updateQueryParam(href, 'param', 'newvalue', 'oldvalue')
    expect(result).toEqual('www.example.com/some/directory?param=newvalue')
    done()
  })

  test('adds param if required', async done => {
    const href = 'www.example.com/some/directory?differentparam=fake'
    const result = updateQueryParam(href, 'param', 'newvalue', 'oldvalue')
    expect(result).toEqual('www.example.com/some/directory?differentparam=fake&param=newvalue')
    done()
  })

  test('updates query value', async done => {
    const href = 'www.example.com/some/directory?param=oldvalue'
    const result = updateQueryParam(href, 'param', 'newvalue', 'oldvalue')
    expect(result).toEqual('www.example.com/some/directory?param=newvalue')
    done()
  })
})
