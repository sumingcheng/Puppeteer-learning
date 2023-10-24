const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const util = require('util')

function formatObject(obj) {
  console.log(util.inspect(obj, {depth: null, colors: true}))
}

// 定义一个函数来捕获新的项
async function captureNewItems(element, itemSelector) {
  const container = element.querySelector(itemSelector)
  const divs = Array.from(container.querySelectorAll('div'))
  const items = divs.map(div => {
    const link = div.querySelector('a')
    if (link) {
      const titleDiv = div.querySelector('div:nth-child(2) span')
      const title = titleDiv ? titleDiv.getAttribute('title') : ''
      return {type: 'article', href: link.getAttribute('href'), title}
    }
    return null
  }).filter(item => item)  // 去掉 null 或 undefined 的项
  return items
}

async function captureItems(page, scrollSelector, itemSelector) {
  // 将 captureNewItems 函数暴露给页面上下文
  await page.exposeFunction('captureNewItems', captureNewItems)

  return await page.evaluate(async (scrollSelector, itemSelector) => {
    const element = document.querySelector(scrollSelector)
    let items = []
    const distance = 100  // 滚动距离，可根据需要调整
    let currentScroll = 0

    return new Promise((resolve) => {
      const timer = setInterval(async () => {
        currentScroll += distance
        element.scrollTop = currentScroll

        // 捕获新加载的项
        const newItems = await window.captureNewItems(element, itemSelector)
        items = items.concat(newItems)

        if (currentScroll >= element.scrollHeight) {
          clearInterval(timer)
          resolve(items)
        }
      }, 300)  // 每200毫秒滚动，可根据需要调整
    })
  }, scrollSelector, itemSelector)
}

function formatTitle(title) {
  return title.replace(/[\/\\?%*:|"<>]/g, '-')
}

// 主程序
(async () => {
  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()

  // 设置视口大小为2K分辨率
  await page.setViewport({width: 2560, height: 1440})
  await page.goto('https://www.yuque.com/sumingcheng/javascript')
  const items = await captureItems(page, '#rc-tabs-0-panel-Catalog > div > div > div > div', '#rc-tabs-0-panel-Catalog > div > div > div > div > div')


  formatObject(items)
  if (!fs.existsSync(path.join(__dirname, 'output'))) {
    fs.mkdirSync(path.join(__dirname, 'output'))
  }

  for (let item of items) {
    if (item && item.type === 'article') {
      const fullUrl = 'https://www.yuque.com' + item.href + '/markdown?plain=true&linebreak=false&anchor=false'
      await page.goto(fullUrl)
      // 获取纯文本内容
      const content = await page.evaluate(() => {
        const contentElement = document.querySelector('body > pre')
        return contentElement ? contentElement.innerText : ''
      })
      fs.writeFileSync(path.join(__dirname, 'output', `${formatTitle(item.title)}.md`), content)
    }
  }

  await browser.close()
})()
