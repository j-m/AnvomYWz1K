'use strict'

process.env.DATABASE = ':memory:'
require('../../../src/main')
const connection = require('../../../src/database/connection.js')
jest.setTimeout(30000);

const puppeteer = require('puppeteer')
const PuppeteerHar = require('puppeteer-har')

const width = 1920
const height = 1080
const delayMS = 15
const headless = false
const basePath = 'test/acceptance/puppeteer/screenshots'

let browser
let page
let har

beforeAll(async done => {
  await connection.open()
  await connection.run('insert.admin')
  browser = await puppeteer.launch({ headless: headless, slowMo: delayMS, args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    `--window-size=${width},${height}`
  ]})
  page = await browser.newPage()
  har = new PuppeteerHar(page)
  await page.setViewport({ width, height })
  await page.tracing.start({path: 'test/acceptance/puppeteer/trace/games.json',screenshots: true})
  await har.start({ path: 'test/acceptance/puppeteer/trace/games.har' })
  done()
})

afterAll(async done => {
  await page.tracing.stop()
  await har.stop()
  await page.close()
  await browser.close()
  done()
})

describe('Flow', () => {
  test('navigate home', async done => {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      page.goto('http://localhost:5000/games/')
    ])

    expect(await page.screenshot({ path: `${basePath}/navigate-home.png`})).toMatchSnapshot()
    done()
  })

  test('login admin', async done => {
    await (await page.$x('//a[contains(text(), \'Login\')]'))[0].click()

    expect(await page.screenshot({ path: `${basePath}/log-in-form.png`})).toMatchSnapshot()

    await page.type('input[id=username]', 'admin')
    await page.type('input[id=password]', 'admin')

    const showLoginPopup = (await page.$x('//*[@id="login"]/input[3]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      showLoginPopup.click()
    ])

    expect(await page.screenshot({ path: `${basePath}/logged-in-admin.png`})).toMatchSnapshot()
    done()
  })

  test('add Stardew Valley', async done => {
    await (await page.$x('//*[@class="addGameButton"]'))[0].click()

    expect(await page.screenshot({ path: `${basePath}/create-game-form.png`})).toMatchSnapshot()

    await page.type('input[id=steamAppID]', '413150')
    await page.type('input[id=title]', 'Stardew Valley')
    await page.type('input[id=summary]', 'Farming RPG')

    await page.type('input[id=developer]', 'ConcernedApe')
    await page.type('input[id=publisher]', 'ConcernedApe')
    await page.type('input[id=category]', 'RPG')
    await page.type('textarea[id=description]', 'This is a much longer description. \n That can span multiple lines. ')

    const submitGameCreate = (await page.$x('//*[@id="addGame"]/input[@value="Create"]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      submitGameCreate.click()
    ])

    expect(await page.screenshot({ path: `${basePath}/stardew-added.png`})).toMatchSnapshot()
    done()
  })

  test('view stardew', async done => {
    const stardewThumbnail = (await page.$x('//*[@id="games"]/div/a'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      stardewThumbnail.click()
    ])

    expect(await page.screenshot({ path: `${basePath}/view-stardew.png`})).toMatchSnapshot()
    done()
  })

  test('edit stardew', async done => {
    const editButton = (await page.$x('//*[@id="edit"]'))[0]
    await editButton.click()
    expect(await page.screenshot({ path: `${basePath}/edit-form-stardew.png`})).toMatchSnapshot()
    done()
  })
})

