// dependencies
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var expressHandlebars = require("express-handlebars");

// setup port
var PORT = process.env.PORT || 3000;

// instantiate express app
var app = express();

// setup express router
var router = express.Router();

// designate public folder as static directory
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }))

// have requests go through router middleware
app.use(router);

// use deployed database, if not deployed use local database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// connect mongoose to database
mongoose.connect(db, function(error) {
  if(error) {
    console.log(error);
  }
  else {
    console.log("mongoose connection is successful");
  }
});

// listen on port 3000
app.listen(PORT, function() {
  console.log("Listening on port:" + PORT);
});