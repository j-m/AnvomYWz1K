const path = require('path')
const views = require('koa-views')

function getViews (context, next) {
  const middleware = views(path.join(__dirname, '../views'), {
    extension: 'hbs',
    options: {
      partials: {
        loginRegistration: './partials/loginRegistration'
      },
      settings: {
        views: path.join(__dirname, '../views')
      }
    },
    map: { hbs: 'handlebars' }
  })
  return middleware(context, next)
}

module.exports = { getViews }
