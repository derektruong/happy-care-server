const Parser = require('rss-parser');
const parser = new Parser();

(async () => {
  const feed = await parser.parseURL('https://vnexpress.net/rss/suc-khoe.rss');
  console.log(feed.title);

  const newsData = feed.items.map((item) => {
    const img = item.content.match('\<img.+src\=(?:\"|\')(.+?)(?:\"|\')(?:.+?)\>');
    const imgUrl = img ? img[1] : '';
    const description = item.content.split('</br>')[1];

    return { 
      title: item.title,
      description,
      imgUrl,
      link: item.link
    };
  });
  
})();
