const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

async function run() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  await page.goto('https://www.bing.com/?mkt=zh-CN')
  
  await page.type('input[name="q"]', '深拷贝')
  await page.keyboard.press('Enter')
  
  await page.waitForNavigation()
  await page.waitForSelector('#b_results')
  
  const searchResults = await page.$$eval('#b_results > li.b_algo > h2 > a', anchors => {
    return anchors.slice(0, 10).map(anchor => anchor.href)
  })
  
  const dir = path.join(__dirname, '..', 'screenshot') //将 screenshot 目录放在同级目录下
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  
  for (let i = 0; i < searchResults.length; i ++) {
    try {
      await page.goto(searchResults[i])
      await page.waitForTimeout(3000) // 等待一段时间，确保页面加载完全
      const fileName = `search-result-${i + 1}.png`
      const filePath = path.join(dir, fileName)
      console.log(filePath)
      await page.screenshot({ path: filePath })
      console.log(`Screenshot saved: ${filePath}`)
    } catch (error) {
      console.error(`Error taking screenshot #${i + 1}: ${error.message}`)
    }
  }
  
  await browser.close()
}

run()
