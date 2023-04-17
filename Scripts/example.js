const puppeteer = require('puppeteer')
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://example.com')
  
  // 确保截图目录存在
  const dir = './screenshot'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  
  await page.screenshot({ path: `${dir}/example.png` })
  
  await browser.close()
})()
