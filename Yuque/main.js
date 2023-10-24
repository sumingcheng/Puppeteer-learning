const puppeteer = require('puppeteer');
const path = require('path');
const captureItems = require('./captureItems');
const {formatObject, formatTitle} = require('./utils');
const {ensureOutputDirectory, saveToFile} = require('./fileOperations');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 2560, height: 1440});
  await page.goto('https://www.yuque.com/sumingcheng/javascript');

  const items = await captureItems(
      page,
      '#rc-tabs-0-panel-Catalog > div > div > div > div',
      '#rc-tabs-0-panel-Catalog > div > div > div > div > div'
  );

  formatObject(items);

  const outputDirectory = path.join(__dirname, 'output');
  ensureOutputDirectory(outputDirectory);

  for (let item of items) {
    if (item && item.type === 'article') {
      const fullUrl = 'https://www.yuque.com' + item.href + '/markdown?plain=true&linebreak=false&anchor=false';
      await page.goto(fullUrl);

      const content = await page.evaluate(() => {
        const contentElement = document.querySelector('body > pre');
        return contentElement ? contentElement.innerText : '';
      });

      const fileName = `${formatTitle(item.title)}.md`;
      saveToFile(outputDirectory, fileName, content);
    }
  }

  await browser.close();
})();
