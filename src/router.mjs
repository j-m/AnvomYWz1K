import Router from 'koa-router'

const router = new Router()

router.get('/', async context => {
  await context.render('index', { text: 'test' })
})

export default router
