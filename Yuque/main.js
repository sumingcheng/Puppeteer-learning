const puppeteer = require('puppeteer')
const path = require('path')
const captureItems = require('./captureItems')
const {formatObject, formatTitle} = require('./utils')
const {ensureOutputDirectory, saveToFile} = require('./fileOperations');

(async () => {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.setViewport({width: 2560, height: 1440})
  await page.goto('https://www.yuque.com/sweetmilllk/qpkhc9')

  let items = await captureItems(
      page,
      '#rc-tabs-0-panel-Catalog > div > div > div > div',
      '#rc-tabs-0-panel-Catalog > div > div > div > div > div'
  )

  formatObject(items)
  console.log(`共检索到${items.length}项`)

  const outputDirectory = path.join(__dirname, 'output')
  ensureOutputDirectory(outputDirectory)

  // items = items.slice(0, 1)
  for (let item of items) {
    if (item && item.type === 'article') {
      const fullUrl = 'https://www.yuque.com' + item.href + '/markdown?plain=true&linebreak=false&anchor=false'
      await page.goto(fullUrl)

      await page.waitForSelector('body > pre')  // 等待这个元素加载完成

      const content = await page.evaluate(() => {
        const contentElement = document.querySelector('body > pre')
        return contentElement ? contentElement.innerText : ''
      })
      console.log(content)
      /*此处应进行文档处理*/
      const fileName = `${formatTitle(item.title)}.md`
      saveToFile(outputDirectory, fileName, content)
    }
  }

  console.log('该知识库的所有文章已经保存到output目录下')

  await browser.close()
})()
