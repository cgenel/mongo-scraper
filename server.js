// dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// setup port
var PORT = process.env.PORT || 3000;

// instantiate express app
var app = express();

// setup express router
var router = express.Router();

// designate public folder as static directory
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// have requests go through router middleware
app.use(router);

// use deployed database, if not deployed use local database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// connect mongoose to database
mongoose.connect("mongodb://localhost/unit18Populater", { useUnifiedTopology: true, useNewUrlParser: true });

// listen on port 3000
app.listen(PORT, function() {
  console.log("Listening on port:" + PORT);
});