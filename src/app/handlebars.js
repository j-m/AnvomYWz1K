const path = require('path')
const views = require('koa-views')
const handlebars = require('handlebars')
const { promisify } = require('util')
const fs = require('fs')
const readFilePromise = promisify(fs.readFile)
const glob = require('glob')
const globPromise = promisify(glob)

async function registerPartials () {
  const files = await globPromise('./src/views/partials/**/*.handlebars')
  await Promise.all(files.map(async (file) => {
    const content = await readFilePromise(file, 'utf-8')
    const name = file.replace('./src/views/partials/', '').replace('.handlebars', '')
    handlebars.registerPartial(name, content)
  }))
}

function getViews (context, next) {
  const middleware = views(path.join(__dirname, '../views'), {
    extension: 'handlebars',
    options: {
      settings: {
        views: path.join(__dirname, '../views')
      }
    },
    map: { handlebars: 'handlebars' }
  })
  return middleware(context, next)
}

module.exports = { registerPartials, getViews }
