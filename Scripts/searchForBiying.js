const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch(); // 打开一个无界面的Chrome浏览器实例
  const page = await browser.newPage(); // 打开一个新页面
  
  await page.goto('https://www.bing.com/?mkt=zh-CN'); // 访问https://www.bing.com/?mkt=zh-CN
  await page.type('#sb_form_q', '搜索关键字'); // 在搜索框中键入搜索关键字
  
  await page.waitForSelector('#sb_form_go'); // 等待搜索按钮加载
  await page.click('#sb_form_go'); // 点击搜索按钮
  
  await page.waitForSelector('#b_results'); // 等待搜索结果加载完成
  
  // 等待5秒钟后关闭浏览器
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await browser.close();
})();
