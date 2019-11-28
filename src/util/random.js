'use strict'

function base64String() {
	const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
	let output = ''
	const times = 10
	for(let i = 0; i < times; i++) {
		output += BASE64[Math.floor(Math.random() * BASE64.length)]
	}
	return output
}

module.exports = { base64String }
