'use strict'

process.env.DATABASE = ':memory:'
require('../../../src/main')
const connection = require('../../../src/database/connection.js')

const puppeteer = require('puppeteer')
const PuppeteerHar = require('puppeteer-har')

const width = 1920
const height = 1080
const delayMS = 0
const headless = true

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
  await browser.close()
  done()
})

describe('Flow', () => {
  test('navigate home', async done => {
    await page.goto('http://localhost:5000/games/')

    const image = await page.screenshot({ path: 'test/acceptance/puppeteer/screenshots/1-navigate-home.png' })
    expect(image).toMatchSnapshot()
    done()
  })

  test('login admin', async done => {
    await (await page.$x('//a[contains(text(), \'Login\')]'))[0].click()
    await page.type('input[id=username]', 'admin')
    await page.type('input[id=password]', 'admin')
    await (await page.$x('//*[@id="login"]/input[3]'))[0].click()
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

    const image = await page.screenshot({ path: 'test/acceptance/puppeteer/screenshots/2-login-admin.png' })
    expect(image).toMatchSnapshot()
    done()
  })
})

