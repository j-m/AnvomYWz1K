const Koa = require('koa')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')

const handlebars = require('./handlebars.js')
const router = require('./router.js')

const app = new Koa()
app.use(staticDir('static'))
app.use(bodyParser())
app.use((context, next) => handlebars.getViews(context, next))
app.use(async (context, next) => { await handlebars.registerPartials() })
app.use(router.routes())

module.exports = app
