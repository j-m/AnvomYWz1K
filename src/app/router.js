const Router = require('koa-router')

const games = require('../routes/get/games')

const login = require('../routes/post/login')
const register = require('../routes/post/register')
const logout = require('../routes/post/logout')
const username = require('../routes/post/username')

const router = new Router()

router.redirect('/', '/games/')
router.get('/games', async (context, next) => { await games(context, next) })

router.post('/login', async (context, next) => { await login(context, next) })
router.post('/register', async (context, next) => { await register(context, next) })
router.post('/logout', async (context, next) => { await logout(context, next) })
router.post('/username', async (context, next) => { await username(context, next) })

module.exports = router
