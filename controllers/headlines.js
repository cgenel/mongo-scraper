// bring in scrape script and makeDate scripts
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

// bring in headline and note models
var Headline = require("../models/Headline");

// functionality for deleting and saving articles
module.exports = {

  // fetch will run the scrape function to grab all articles and insert into headline collection in mongoDB
  fetch: function(cb) {
    // run scrape, set data to be called 'articles'
    scrape(function(data) {
      var articles = data;

      // loop through each article and run makeDate function
      for (var i = 0; i < articles.length; i++) {
        articles[i].date = makeDate();
        articles[i].saved = false;
      }

      // mongo function to grab headline and insert many articles into the collection, (err, docs) will skip over errors 
      Headline.collection.insertMany(articles, {ordered:false}, function(err, docs) {
        cb(err, docs);
      });
    });
  },

  // delete propery to remove articles
  delete: function(query, cb) {
    Headline.remove(query, cb);
  },

  // get all items out with 'get' function and sort items from most recent to least recent
  get: function(query, cb) {
    Headline.find(query).sort({
      _id: -1
    })
    .exec(function(err, doc) {
      cb(doc);
    });
  },

  // function to update new articles that are scraped with relevant id and any information
  update: function(query, cb) {
    console.log('UPDATING FROM CONTROLLER')
    if(query) {
      Headline.update({_id: query._id}, {
        $set: query
      }, {}, cb);
    } else {
      console.log('NO QUERY SPECIFIED')
    }
  }
}