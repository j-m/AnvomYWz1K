'use strict'

async function notFound(context) {
	await context.render('404')
}

module.exports = notFound
