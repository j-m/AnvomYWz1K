'use strict'

const ErrorEnum = require('../../../src/util/ErrorEnum')
const handleError = require('../../../src/routes/util/handleError')

describe('routes post util handleError', () => {
	test('throws if error missing', async done => {
		const result = handleError()
		expect(result).toEqual({ success: false, code: ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING })
		done()
	})

	test('returns code if known error', async done => {
		const result = handleError(new Error(ErrorEnum.GAME_TITLE_MISSING))
		expect(result).toEqual({success: false, code: ErrorEnum.GAME_TITLE_MISSING})
		done()
	})

	test('returns blank message if unknown enum', async done => {
		const result = handleError(new Error(ErrorEnum.TOTALLY_MADE_UP))
		expect(result).toEqual({success: false, message: ''})
		done()
	})

	test('returns message if unknown error', async done => {
		const result = handleError(new Error('unknown'))
		expect(result).toEqual({success: false, message: 'unknown'})
		done()
	})
})
