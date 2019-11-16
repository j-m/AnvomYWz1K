'use strict'

const ErrorEnum = require('../../../../src/util/ErrorEnum')
const handleError = require('../../../../src/routes/post/util/handleError')

describe('routes post util handleError', () => {
  test('throws if context missing', async done => {
    expect(handleError).toThrow(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
    done()
  })

  test('throws if error missing', async done => {
    expect(() => handleError({})).toThrow(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
    done()
  })

  test('returns code if known error', async done => {
    const context = {body: ''}
    handleError(context, new Error(ErrorEnum.GAME_TITLE_MISSING))
    expect(context.body).toEqual({success: false, code: ErrorEnum.GAME_TITLE_MISSING})
    done()
  })

  test('returns message if unknown error', async done => {
    const context = {body: ''}
    handleError(context, new Error('unknown'))
    expect(context.body).toEqual({success: false, message: 'unknown'})
    done()
  })
})
