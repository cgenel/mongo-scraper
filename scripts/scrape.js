// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {

  // requesting from new york times
  request("http://www.nytimes.com", function(err, res, bodyy) {

     var $ = cheerio.load(body);

    //  empty articles array
     var articles = [];

     $(".theme-summary").each(function(i, element) {

      var head = $(this).children(".story-heading").text().trim();
      var sum = $(this).children(".summary").text().trim();

      if(head && sum) {
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        var dataToAdd = {
          headline: headNeat,
          summary: sumNeat
        };

        articles.push(dataToAdd);
      }
     });
     cb(articles);
  });
};
module.exports = scrape;