const Koa = require('koa')
const views = require('koa-views')
const router = require('./router.js')

const app = new Koa()
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, { map: { handlebars: 'handlebars' } }))
app.use(router.routes())

module.exports = app
