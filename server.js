// dependencies
var express = require("express");
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

// listen on port 3000
app.listen(PORT, function() {
  console.log("Listening on port:" + PORT);
});