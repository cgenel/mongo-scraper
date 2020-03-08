// scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var request = require("request");
var cheerio = require("cheerio");

// scrape function (cb) is "callback"
var scrape = function (cb) {

  // requesting from wsj.com(wall street journal)
  request("https://www.wsj.com/", function(err, res, body) {

    // cheerio.load in body with '$' as selector to be used like jquery
     var $ = cheerio.load(body);

    //  new empty articles array
     var articles = [];

    // select all theme--storys from new york times
     $(".WSJTheme--story--pKzwqDTt").each(function(i, element) {

      // grab text for story headline & theme summary and trim off white space set to variables head & sum
      var head = $(this).children(".WSJTheme--summary--12br5Svc").text().trim();
      var sum = $(this).children(".WSJTheme--summary--12br5Svc").text().trim();

      // if scrape success, then use replace regExp methods, cleans up text with white space
      if(head && sum) {
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        // take the data from headNeat & sumNeat and use as headline and summary for new articles
        var dataToAdd = {
          headline: headNeat,
          summary: sumNeat
        };

        // push new data to articles array
        articles.push(dataToAdd);
      }
     });

    //  call back function to send articles
     cb(articles);
  });
};

// export scrape
module.exports = scrape;