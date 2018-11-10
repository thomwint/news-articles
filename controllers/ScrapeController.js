const axios = require('axios');
const cheerio = require('cheerio');

module.exports = (app) => {
  app.get('/', (req, res) => res.render('index'));

  app.get('/api/search', (req, res) => {
    axios.get('https://www.reuters.com/news/archive/newsOne').then((resp) => {
      const $ = cheerio.load(resp.data);
      const hbsObject = { data: [] };

      $('.story-content').each((i, element) => {
        hbsObject.data.push({
          headline: $(element).children('a').children().text()
            .trim(),
          summary: $(element).children('p').text(),
          url: `https://www.reuters.com/news/archive/newsOne${$(element).children('a').attr('href')}`,
          note: null,
        });
      });
      res.render('index', hbsObject);
      console.log(hbsObject);
    });
  });
};
