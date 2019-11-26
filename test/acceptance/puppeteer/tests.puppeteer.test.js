'use strict'

process.env.DATABASE = ':memory:'
require('../../../src/main')

const puppeteer = require('puppeteer')
const baseURL = `http://${process.env.HOST||'localhost'}:${process.env.PORT||'5000'}`
let browser

beforeAll(async() => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 100
  })
})

afterAll(async() => {
  await browser.close()
})

describe('Page Games', () => {
  test('games', async() => {
    const page = await browser.newPage()
    await page.goto(baseURL)
    await page.screenshot({ path: 'test/acceptance/puppeteer/screenshots/games.png' })
  })
})

