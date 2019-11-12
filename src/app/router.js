const Router = require('koa-router')

const game = require('../routes/get/game')
const games = require('../routes/get/games')
const review = require('../routes/get/review')
const reviews = require('../routes/get/reviews')
const comment = require('../routes/get/comments')
const comments = require('../routes/get/comments')
const user = require('../routes/get/user')
const assessment = require('../routes/get/assessment')
const flag = require('../routes/get/flag')

const login = require('../routes/post/login')
const register = require('../routes/post/register')

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

router.post('/login', async (context, next) => { await login(context, next) })
router.post('/register', async (context, next) => { await register(context, next) })

module.exports = router
