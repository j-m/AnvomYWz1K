'use strict'

const Koa = require('koa')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')

const handlebars = require('./handlebars')
const router = require('./router')

const app = new Koa()
app.keys = ['Jonathan Marsh']
app.use(staticDir('static'))
app.use(bodyParser())
app.use(session(app))
app.use(async(context, next) => await handlebars.getViews(context, next))
app.use(router.routes())

module.exports = app
