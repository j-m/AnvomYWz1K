'use strict'

const Router = require('koa-router')

const authenticate = require('../routes/middleware/authenticate')

const gamesPage = require('../routes/pages/games')
const gamePage = require('../routes/pages/game')
const commentsPage = require('../routes/pages/comments')

const login = require('../routes/post/login')
const register = require('../routes/post/register')
const logout = require('../routes/post/logout')
const username = require('../routes/post/username')

const newGame = require('../routes/post/game')
const editGame = require('../routes/post/editGame')
const review = require('../routes/post/review')
const comment = require('../routes/post/comment')

const router = new Router()

router.redirect('/', '/games/')
router.get('/games', authenticate.populateSession, gamesPage)
router.get('/games/:game', authenticate.populateSession, gamePage)
router.get('/games/:game/:author/:type', authenticate.populateSession, commentsPage)

router.post('/login', authenticate.isNotLoggedIn, login)
router.post('/register', authenticate.isNotLoggedIn, register)
router.post('/logout', authenticate.isLoggedIn, logout)
router.post('/username', authenticate.isNotLoggedIn, username)

router.post('/game', authenticate.isAdmin, newGame)
router.post('/editGame', authenticate.isAdmin, editGame)
router.post('/review', authenticate.isLoggedIn, review)
router.post('/comment', authenticate.isLoggedIn, comment)

module.exports = router
