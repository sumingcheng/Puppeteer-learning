const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  
  const dir = path.join(__dirname, '..', 'screenshot'); // 将 screenshot 目录放在同级目录下
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  
  await page.screenshot({ path: path.join(dir, 'example.png') });
  
  await browser.close();
})();
