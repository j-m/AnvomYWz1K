'use strict'

const removeServerPort = require('../../src/test/util/removeServerPort')

describe('removeServerPort', () => {
	test('removes the live server port from anchor tag hrefs', async done => {
		const input = '<a href="http://127.0.0.1:55988/games/idUnique?l&#x3D;1">More reviews</a>'
		const output = removeServerPort(input)
		expect(output).toEqual('<a href="http://baseURL/games/idUnique?l&#x3D;1">More reviews</a>')
		done()
	})
})
