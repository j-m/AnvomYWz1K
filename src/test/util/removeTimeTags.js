'use strict'

function removeTimeTags(body) {
	const regex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/g
	body = body.replace(regex, 'timestamp')
	return body
}

module.exports = removeTimeTags
