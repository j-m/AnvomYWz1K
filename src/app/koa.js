'use strict'

const Koa = require('koa')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const encryptedSession = require('koa-encrypted-session')

const handlebars = require('./handlebars')
const router = require('./router')
const MAGIC_NUMBERS = require('../util/magicNumbers')

const app = new Koa()
app.keys = ['Jonathan Marsh']
app.use(staticDir('static'))
app.use(bodyParser())
app.use(encryptedSession({
  key: 'session',
  maxAge: MAGIC_NUMBERS.ONE_WEEK,
  secret: '_marshj6@coventry_Jonathan_Marsh'
}, app))
app.use(async(context, next) => await handlebars.getViews(context, next))
app.use(router.routes())

module.exports = app
