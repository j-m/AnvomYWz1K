const Router = require('koa-router')

const game = require('../routes/game')
const games = require('../routes/games')
const review = require('../routes/review')
const reviews = require('../routes/reviews')
const comment = require('../routes/comments')
const comments = require('../routes/comments')
const user = require('../routes/user')
const assessment = require('../routes/assessment')
const flag = require('../routes/flag')

const router = new Router()

router.redirect('/', '/games/')
router.get('/games', async (context, next) => { await games(context, next) })
router.get('/games/:game', async (context, next) => { await game(context, next) })
router.get('/games/:game/reviews', async (context, next) => { await reviews(context, next) })
router.get('/games/:game/reviews/:review', async (context, next) => { await review(context, next) })
router.get('/games/:game/reviews/:review/comments', async (context, next) => { await comments(context, next) })
router.get('/games/:game/reviews/:review/comments/:comment', async (context, next) => { await comment(context, next) })
router.get('/user/:id', async (context, next) => { await user(context, next) })
router.get('/assessment/:id', async (context, next) => { await assessment(context, next) })
router.get('/flag/', async (context, next) => { await flag(context, next) })

module.exports = router
