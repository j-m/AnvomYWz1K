/**
 * The landing page visible to visitors.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication None.
 */
async function game (context, next) {
  await context.render('index', { text: 'test' })
}

module.exports = game
