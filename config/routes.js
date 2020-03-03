// server routes

// bring in scrape function from the scripts directory
var scrape = require("../scripts/scrape");

// bring headlines and notes from the controller
var headlinesController = require("../controller.headlines");
var notesController = require("../controllers/notes");

module.exports = function (router) {
  
  // route to render homepage
  router.get("/", function (req, res) {
    res.render("home");
  });

  // route to render the saved handlebars page
  router.get("/saved", function (req, res) {
    res.render("saved");
  });

  // router get api/fetch and run function
  router.get("/api/fetch", function (req, res) {
    // run fetch to message user
    headlinesController.fetch(function (err, docs) {
      // no new articles are no articles at all alert user 
      if (!docs || docs.insertedCount === 0) {
        res.json({
          message: "No new articles today, check back tomorrow!"
        });
      }
      // message user when new articles added
      else {
        res.json({
          message: "Added " + docs.insertedCount + " new articles!"
        });
      }
    });
  });

  // get api/headlines and take in what the user requests and respond appropriately 
  router.get("/api/headlines", function (req, res) {
    // user request is defined by 'query'
    var query = {};
    // if the user specifys a saved article or any specific paramater set query to that
    if (req.query.saved) {
      query = req.query;
    }
    headlinesController.get(query, function (data) {
      res.json(data);
    });
  });

  // route for deleting specefic articles
  router.delete("/api/headlines/:id", function (req, res) {
    var query = {};
    // set query to request params id and pass into delete function in the headlinesController
    query._id = req.params.id;
    headlinesController.delete(query, function (err, data) {
      res.json(data);
    });
  });

  // create a route to update headlines
  router.patch("/api/headlines", function(req, res) {
    headlinesController.update(req.body, function(err, data) {
      res.json(data);
    });
  });

  // route for grabbing notes associated with an article
  router.get("/api/notes/:headline_id?", function(req, res) {
    var query = {};
    if (req.params.headline_id) {
      query._id = req.params.headline_id;
    }

    notesController.get(query, function(err, data) {
      res.json(data);
    });
  });

  // router for deleting notes
  router.delete("/api/notes/:id", function(req, res) {
    var query = {};
    // delete function based on users choice
    query._id = req.params.id;
    notesController.delete(query, function(err, data) {
      res.json(data);
    });
  });

  // router for posting new notes to articles
  router.post("/api/notes", function(req, res) {
    // runs save function and uses what user sent as the request body, returns data in json to display in front end
    notesController.save(req.body, function(data) {
      res.json(data);
    });
  });
}