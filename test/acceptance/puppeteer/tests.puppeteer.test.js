'use strict'

const puppeteer = require('puppeteer')

let browser
let page

beforeAll(async() => {
  browser = await puppeteer.launch({
    headless: process.env.SLOW_MO ? false : true,
    slowMo: process.env.SLOW_MO || 0
  })
  page = await browser.newPage()
  await page.goto(`http://${process.env.HOST}:${process.env.PORT}`)
})

afterAll(async() => {
  await browser.close()
})

describe('Page Games', () => {
  test('with correct title', async() => {
    await expect(page.title()).resolves.toMatch('Game Reviews - Games')
  })
})

