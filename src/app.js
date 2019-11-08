import Koa from 'koa'
import views from 'koa-views'
import router from './router.mjs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = new Koa()
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, { map: { handlebars: 'handlebars' } }))
app.use(router.routes())

export default app
