const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  // 跳转到 bing.com
  await page.goto('https://www.bing.com/?mkt=zh-CN')
  
  // 在搜索框输入 "深拷贝"，然后回车
  await page.type('input[name="q"]', '深拷贝')
  await page.keyboard.press('Enter')
  
  // 等待搜索结果加载
  await page.waitForSelector('#b_results')
  
  // 获取前十个搜索结果并截屏
  const searchResults = await page.$$eval('#b_results > li.b_algo > h2 > a', anchors => {
    return anchors.slice(0, 10).map(anchor => anchor.href)
  })
  
  for (let i = 0; i < searchResults.length; i ++) {
    await page.goto(searchResults[i])
    await page.screenshot({ path: __dirname + `./screenshot/search-result-${i + 1}.png` })
  }
  
  await browser.close()
})()
