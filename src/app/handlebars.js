'use strict'

const path = require('path')
const views = require('koa-views')

function equal(left, right) {
	return left === right
}

function or(left, right) {
	return left === true || right === true
}

function visible(visibility, author, username, privileges) {
	return visibility === 'public'
      || privileges === 'administrator'
      || author === username
      || visibility === 'moderator' && privileges === 'moderator'
}

function getViews(context, next) {
	const middleware = views(path.join(__dirname, '../views'), {
		extension: 'hbs',
		options: {
			helpers: {
				equal, or, visible
			},
			partials: {
				loginRegistration: './partials/loginRegistration',
				gameFields: './partials/gameFields'
			},
			settings: {
				views: path.join(__dirname, '../views')
			}
		},
		map: { hbs: 'handlebars' }
	})
	return middleware(context, next)
}

module.exports = { getViews }
