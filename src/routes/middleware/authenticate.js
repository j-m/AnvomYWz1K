'use strict'

const ErrorEnum = require('../../util/ErrorEnum')
const Session = require('../util/Session')

async function isAdmin(context, next) {
	const session = new Session(context.session)
	if (!session.administrator) {
		throw new Error(ErrorEnum.SESSION_INSUFFICIENT_PRIVILEGES)
	}
	context.request.cookieData = session
	await next()
}

async function isModerator(context, next) {
	const session = new Session(context.session)
	if (!session.moderator) {
		throw new Error(ErrorEnum.SESSION_INSUFFICIENT_PRIVILEGES)
	}
	context.request.cookieData = session
	await next()
}

async function isLoggedIn(context, next) {
	const session = new Session(context.session)
	if (!session.authorised) {
		throw new Error(ErrorEnum.SESSION_NOT_LOGGED_IN)
	}
	context.request.cookieData = session
	await next()
}

async function isNotLoggedIn(context, next) {
	const session = new Session(context.session)
	if (session.authorised) {
		throw new Error(ErrorEnum.SESSION_LOGGED_IN)
	}
	context.request.cookieData = session
	await next()
}

async function populateSession(context, next) {
	const session = new Session(context.session)
	context.request.cookieData = session
	await next()
}

module.exports = { isNotLoggedIn, isLoggedIn, isModerator, isAdmin, populateSession }
