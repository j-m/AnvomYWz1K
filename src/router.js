const Router = require('koa-router')

const router = new Router()

/**
 * The landing page visible to visitors.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication None.
 */
router.get('/', async context => {
  await context.render('index', { text: 'test' })
})

module.exports = router
