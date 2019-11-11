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
router.get('/games/', (context, next) => games(context, next))
router.get('/games/:game', (context, next) => game(context, next))
router.get('/games/:game/reviews', (context, next) => reviews(context, next))
router.get('/games/:game/reviews/:review', (context, next) => review(context, next))
router.get('/games/:game/reviews/:review/comments', (context, next) => comments(context, next))
router.get('/games/:game/reviews/:review/comments/:comment', (context, next) => comment(context, next))
router.get('/user/:id', (context, next) => user(context, next))
router.get('/assessment/:id', (context, next) => assessment(context, next))
router.get('/flag/', (context, next) => flag(context, next))

module.exports = router
