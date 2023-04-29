const express = require('express');
const cors = require('cors');
const request = require('request');
const cheerio = require('cheerio');

const app = express();
app.use(cors());

const site = "https://www.mindwareworks.com/";

app.get('/team', (req, res) => {
  let name = "";
  let image = "";
  let job = "";
  let combined = "";
  let nameResult = [];
  let imageResult = [];
  let jobResult = [];

  request(site + 'company/team.do', (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      
      $('div.thumb').each((i, link) => {
        name = $(link).find('span').text();
        nameResult.push({name});
      });

      $('div.thumb-wrap').each((i, link) => {
        image = site + ($(link).find('img').attr('src'));
        imageResult.push({image});
      });

      $('.company-team-inner li strong').each((i, link) => {
        job = $(link).text();
        jobResult.push({job});
      });

      combined = nameResult.map((item, i) => Object.assign({}, item, imageResult[i], jobResult[i]));

      res.send(combined);
    } else {
      console.log("오류");
      res.sendStatus(500);
    }
  });
});

app.listen(3000, () => console.log('Server is running on port 3000.'));
