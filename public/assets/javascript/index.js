import { Aggregate } from "mongoose";

$(document).ready(function () {
  // setting reference to the article-container div where all dynamic content will be displayed
  var articleContainer = $(".article-container");

  // add event listeners to any dynamically generated 'save article' & add "scrape new article" buttons
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);

  // when page is rerady run the initPage function
  initPage();

  function initPage() {
    // empty the article container, run AJAX request for unsaved headlines
    articleContainer.empty();
    $.get("/api/headlines?saved=false")
      .then(function (data) {
        // if there are headlines, render to page
        if (data && data.length) {
          renderArticles(data);
        }
        else {
          // render "no articles" message
          renderEmpty();
        }
      });
  }

  // function to handle appending html containing article data to the page
  function renderArticles(articles) {
    // array containing all available articles in db
    var articlePanels = [];

    // pass each article object to createPanel function that returns bootstrap panel with article data
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }

    // when the html for articles is stored in array, append them to articlePanels container
    articleContainer.append(articlePanels);
  }

  // function to take in json object for article headlin
  function createPanel(article) {
    // construct jquery element containing all formatted html for article panel
    var panel =
      $(["<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        article.headline,
        "<a class='btn btn-success save'>",
        "Save Article",
        "</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>"
      ].join(""));

    // attach articles id to jquery element
    panel.data("_id", article._id);

    // return constructed panel to jquery element
    return panel;
  }

  // function to render html to page when no articles are available
  function renderEmpty() {
    // using a joined arroy of html string data
    var emptyAlert =
      $(["<div class='alert alert-warning text center'>",
        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>What would you like to do?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go To Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join(""));

    // append this data to the page
    articleContainer.append(emptyAlert);
  }

  // function triggered when user wants to save an article
  function handleArticleSave() {
    // retrieve the object containing the headline id
    var articleToSave = $(this).parents(".panel").data();
    articleToSave.saved = true;

    // using patch method for updating to en existing record in collection
    $.ajax({
      method: "PATCH",
      url: "/api/headlines",
      data: articleToSave
    })
      .then(function (data) {
        // if successful mongoose returns an object containg key of "ok"
        if (data.ok) {
          // run initPage function to reload list of articles
          initPage();
        }
      });
  }

  // function to handle user clicking any "scrape new article" buttons
  function handleArticleScrape() {

    $.get("/api/fetch")
      .then(function (data) {
        // if successfully scraped new articles then re render articles to the page 
        initPage();
        // let the user know how many new unique articles were saved with an alert
        bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
      });
  }
});