async function captureItems(page, scrollSelector, itemSelector) {
  const res = await page.evaluate(async (scrollSelector, itemSelector) => {
    const element = document.querySelector(scrollSelector);

    const captureNewItems = (element, itemSelector) => {
      const container = element.querySelector(itemSelector);
      const divs = Array.from(container.querySelectorAll('div'));
      return divs.map(div => {
        const link = div.querySelector('a');
        if (link) {
          const titleDiv = div.querySelector('div:nth-child(2) span');
          const title = titleDiv ? titleDiv.getAttribute('title') : '';
          return {type: 'article', href: link.getAttribute('href'), title};
        }
        return null;
      }).filter(item => item);  // 去掉 null 或 undefined 的项
    };

    const items = [];
    const distance = 100;  // 滚动距离，可根据需要调整
    let currentScroll = 0;

    return new Promise((resolve) => {
      const timer = setInterval(async () => {
        currentScroll += distance;
        element.scrollTop = currentScroll;

        const newItems = captureNewItems(element, itemSelector);
        items.push(...newItems);

        if (currentScroll >= element.scrollHeight) {
          clearInterval(timer);
          resolve(items);
        }
      }, 300);  // 每300毫秒滚动，可根据需要调整
    });
  }, scrollSelector, itemSelector);

  return res;
}


module.exports = captureItems;
