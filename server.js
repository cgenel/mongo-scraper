// dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");

// setup port
var PORT = process.env.PORT || 3000;

// instantiate express app
var app = express();

// setup express router
var router = express.Router();

// require routes filee pass in router object
require("./config/routes")(router);

// designate public folder as static directory
app.use(express.static(__dirname + "/public"));

// connect handlebars to express app
app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// have requests go through router middleware
app.use(router);

// connect mongoose to database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// listen on port 3000
app.listen(PORT, function() {
  console.log("Listening on port:" + PORT);
});