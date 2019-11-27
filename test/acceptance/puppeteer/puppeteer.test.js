'use strict'

process.env.DATABASE = ':memory:'
require('../../../src/main')
const connection = require('../../../src/database/connection.js')
jest.setTimeout(60000)

const puppeteer = require('puppeteer')
const PuppeteerHar = require('puppeteer-har')

const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: { threshold: 2 },
  noColors: true
})
expect.extend({ toMatchImageSnapshot })

const width = 1920
const height = 1080
const delayMS = process.env.CI ? 0 : 30
const headless = process.env.CI ? true : false

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
  page.clear = async selector => {
    await page.evaluate(selector => {
      document.querySelector(selector).value = ''
    }, selector)
  }
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
  test('1 navigate home', async done => {
    let response
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      page.goto('http://localhost:5000/games/').then(data => response = data)
    ])
    expect(response._status).toBe(200)
    expect(await page.screenshot()).toMatchImageSnapshot()

    done()
  })

  test('2 show login', async done => {
    await (await page.$x('//a[contains(text(), \'Login\')]'))[0].click()

    expect(await page.screenshot()).toMatchImageSnapshot()

    done()
  })

  test('3 login unknown', async done => {
    await page.type('input[id=username]', 'unknown')
    await page.type('input[id=password]', 'wrong')

    const submitLogin = (await page.$x('//*[@id="login"]/input[3]'))[0]
    await Promise.all([
      page.waitForSelector('.USERNAME_UNKNOWN.show', {visible: true}),
      submitLogin.click()
    ])
    expect(await page.screenshot()).toMatchImageSnapshot()

    done()
  })

  test('4 login incorrect password', async done => {
    await page.clear('input[id=username]')
    await page.type('input[id=username]', 'admin')
    await page.type('input[id=password]', 'wrong')

    const submitLogin = (await page.$x('//*[@id="login"]/input[3]'))[0]
    await Promise.all([
      page.waitForSelector('.PASSWORD_INCORRECT.show', {visible: true}),
      submitLogin.click()
    ])
    expect(await page.screenshot()).toMatchImageSnapshot()

    done()
  })

  test('5 login admin', async done => {
    await page.clear('input[id=password]')
    await page.type('input[id=password]', 'admin')

    const submitLogin = (await page.$x('//*[@id="login"]/input[3]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      submitLogin.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('6 show add game popup', async done => {
    await (await page.$x('//*[@class="addGameButton"]'))[0].click()
    expect(await page.screenshot()).toMatchImageSnapshot()

    done()
  })
  test('7 add Stardew Valley', async done => {
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

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('7 add RimWorld', async done => {
    await (await page.$x('//*[@class="addGameButton"]'))[0].click()
    await page.type('input[id=steamAppID]', '294100')
    await page.type('input[id=title]', 'RimWorld')
    await page.type('input[id=summary]', 'Space management strategy')
    await page.type('input[id=category]', 'Space')

    const submitGameCreate = (await page.$x('//*[@id="addGame"]/input[@value="Create"]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      submitGameCreate.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })
  test('7 add non steam game', async done => {
    await (await page.$x('//*[@class="addGameButton"]'))[0].click()
    await page.type('input[id=steamAppID]', 'made up')
    await page.type('input[id=title]', 'made up')
    await page.type('input[id=summary]', 'made up')

    const submitGameCreate = (await page.$x('//*[@id="addGame"]/input[@value="Create"]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      submitGameCreate.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('7 add The Sims 3', async done => {
    await (await page.$x('//*[@class="addGameButton"]'))[0].click()
    await page.type('input[id=steamAppID]', '47890')
    await page.type('input[id=title]', 'The Sims™ 3')
    await page.type('input[id=summary]', 'Classic')
    await page.type('input[id=category]', 'RPG')

    const submitGameCreate = (await page.$x('//*[@id="addGame"]/input[@value="Create"]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      submitGameCreate.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('8 view Stardew Valley', async done => {
    const stardewThumbnail = (await page.$x('//*[@src="https://steamcdn-a.akamaihd.net/steam/apps/413150/library_600x900_2x.jpg"]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      stardewThumbnail.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('9 show Stardew Valley long description', async done => {
    const description = (await page.$x('//*[@id="gameInfo"]/a'))[0]
    await description.click()
    expect(await page.screenshot()).toMatchImageSnapshot()
    await description.click()
    done()
  })

  test('10 show edit form for Stardew Valley', async done => {
    const editButton = (await page.$x('//*[@id="edit"]'))[0]
    await editButton.click()
    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('11 add release date for Stardew Valley', async done => {
    await page.type('input[id=releaseDate]', '26022016')
    const submitGameCreate = (await page.$x('//*[@id="updateGame"]/input[@value="Update"]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      submitGameCreate.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('12 log out', async done => {
    const logout = (await page.$x('//*[@id="welcome"]/p/a'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      logout.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('13 show registration form', async done => {
    const register = (await page.$x('//*[@id="welcome"]/p/a[2]'))[0]
    await register.click()
    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('14 click username check', async done => {
    await page.type('input[id=email]', 'a@b.com')
    await page.type('input[id=new-username]', 'admin')

    const checkUsername = (await page.$x('//*[@id="register"]/button'))[0]
    await Promise.all([
      page.waitForSelector('.USERNAME_IN_USE.show', {visible: true}),
      checkUsername.click()
    ])
    expect(await page.screenshot()).toMatchImageSnapshot()

    await page.clear('input[id=new-username]')
    await page.type('input[id=new-username]', 'user')
    await Promise.all([
      page.waitForSelector('.USERNAME_IN_USE', {visible: false}),
      checkUsername.click()
    ])
    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('15 successfully register', async done => {
    await page.type('input[id=new-password]', 'longpassword')

    const submitRegister = (await page.$x('//*[@id="register"]/input[@value="Register"]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      submitRegister.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('16 positive short review', async done => {
    const thumbsUp = (await page.$x('//*[@id="positive"]'))[0]
    await thumbsUp.click()
    await page.type('textarea[id=shortReviewBody]', 'positive short review')
    const submitShortReview = (await page.$x('//*[@id="writeshortReview"]/input[3]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      submitShortReview.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('17 preview positive long review', async done => {
    await page.type('#writelongReview input[type=number]', '93')
    await page.type('textarea[id=longReviewBody]', '![an image](https://via.placeholder.com/150 =250x250 "a title")')

    const previewLongReview = (await page.$x('//*[@id="writelongReview"]/input[2]'))[0]
    await previewLongReview.click()
    expect(await page.screenshot()).toMatchImageSnapshot()

    done()
  })

  test('18 submit positive long review', async done => {
    const closePreview = (await page.$x('//*[@id="preview"]/button'))[0]
    await closePreview.click()

    const submitLongReview = (await page.$x('//*[@id="writelongReview"]/input[3]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      submitLongReview.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('19 update short review to negative', async done => {
    const thumbsDown = (await page.$x('//*[@id="negative"]'))[0]
    await thumbsDown.click()
    await page.clear('textarea[id=shortReviewBody]')
    await page.type('textarea[id=shortReviewBody]', 'bad short review')
    const submitShortReview = (await page.$x('//*[@id="writeshortReview"]/input[3]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      submitShortReview.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('20 update long review to negative', async done => {
    await page.clear('#writelongReview input[type=number]')
    await page.type('#writelongReview input[type=number]', '13')
    await page.clear('textarea[id=longReviewBody]')
    await page.type('textarea[id=longReviewBody]', 'bad')

    const submitLongReview = (await page.$x('//*[@id="writelongReview"]/input[3]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      submitLongReview.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('21 log out and cannot see reviews', async done => {
    const logout = (await page.$x('//*[@id="welcome"]/p/a'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      logout.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('22 login admin can see visibility drop downs', async done => {
    await (await page.$x('//a[contains(text(), \'Login\')]'))[0].click()
    await page.type('input[id=username]', 'admin')
    await page.type('input[id=password]', 'admin')

    const submitLogin = (await page.$x('//*[@id="login"]/input[3]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      submitLogin.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('23 admin change visibility', async done => {
    const shortReviewSelect = await page.$x('//*[@id="shortReviews"]/div/div[1]/div/select')

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      await shortReviewSelect[0].type('public')
    ])

    const longReviewSelect = await page.$x('//*[@id="longReviews"]/div/div[1]/div/select')

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      await longReviewSelect[0].type('public')
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('24 log out and can see reviews', async done => {
    const logout = (await page.$x('//*[@id="welcome"]/p/a'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      logout.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('25 login user can see visibility drop downs', async done => {
    await (await page.$x('//a[contains(text(), \'Login\')]'))[0].click()
    await page.type('input[id=username]', 'user')
    await page.type('input[id=password]', 'longpassword')

    const submitLogin = (await page.$x('//*[@id="login"]/input[3]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      submitLogin.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('26 navigate to comments', async done => {
    const commentsLink = (await page.$x('//*[@id="shortReviews"]/div/div[3]/a'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      commentsLink.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })

  test('27 write a comment', async done => {
    await page.type('input[id=commentInput]', 'this is a very good review. 10/10')

    const submitLogin = (await page.$x('//*[@id="commentForm"]/input[2]'))[0]
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      submitLogin.click()
    ])

    expect(await page.screenshot()).toMatchImageSnapshot()
    done()
  })
})
