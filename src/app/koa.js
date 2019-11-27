'use strict'

const Koa = require('koa')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const encryptedSession = require('koa-encrypted-session')

const handlebars = require('./handlebars')
const router = require('./router')
const MILLISECONDS_IN_A_WEEK = require('../util/magicNumbers').MILLISECONDS_IN_A_WEEK

const app = new Koa()
app.keys = ['Jonathan Marsh']
app.use(staticDir('static'))
app.use(bodyParser())
app.use(encryptedSession({
	key: 'session',
	maxAge: MILLISECONDS_IN_A_WEEK,
	secret: '_marshj6@coventry_Jonathan_Marsh'
}, app))
app.use(async(context, next) => await handlebars.getViews(context, next))
app.use(router.routes())

module.exports = app
