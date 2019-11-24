'use strict'

const removeTimeTags = require('../../src/test/util/removeTimeTags')

describe('removeTimeTags', () => {
  test('remove time stamps from string', async done => {
    const input = '<time datetime="2019-11-20 12:23:59">2019-11-20 12:23:59</time>'
    const output = removeTimeTags(input)
    expect(output).toEqual('<time datetime="timestamp">timestamp</time>')
    done()
  })
})
