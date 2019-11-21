'use strict'

const authorisation = require('./util/authorisation')
const connection = require('../../database/connection')

async function comments(context) {
  const gameID = context.params.game
  const author = context.params.author
  const type = context.params.type

  const parameters = authorisation(context, {})
  parameters.game = gameID
  parameters.author = author
  parameters.type = type
  parameters.review = await connection.all('select.review', gameID, author, type).then(data => { return data })
  parameters.comments = await connection.all('select.comments', gameID, author, type).then(data => { return data })

  await context.render('comments', parameters)
}

module.exports = comments
