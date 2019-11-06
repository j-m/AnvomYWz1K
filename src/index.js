const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')

app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

app.use(async ctx => {
  await ctx.render('index', {text: 'test'})
})

app.listen(3000)
