'use strict'

const Router = require('koa-router')

const gamesPage = require('../routes/pages/games')
const gamePage = require('../routes/pages/game')

const login = require('../routes/post/login')
const register = require('../routes/post/register')
const logout = require('../routes/post/logout')
const username = require('../routes/post/username')
const newGame = require('../routes/post/game')
const editGame = require('../routes/post/editGame')

const router = new Router()

router.redirect('/', '/games/')
router.get('/games', async(context, next) => await gamesPage(context, next))
router.get('/games/:game', async(context, next) => await gamePage(context, next))

router.post('/login', async(context, next) => await login(context, next))
router.post('/register', async(context, next) => await register(context, next))
router.post('/logout', async(context, next) => await logout(context, next))
router.post('/username', async(context, next) => await username(context, next))
router.post('/game', async(context, next) => await newGame(context, next))
router.post('/editGame', async(context, next) => await editGame(context, next))

module.exports = router
