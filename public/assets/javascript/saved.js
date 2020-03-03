const e = require("express");

$(document).ready(function () {
  // setting reference to the article-container div where all dynamic content will be displayed
  var articleContainer = $(".article-container");

  // add event listeners to any dynamically generated buttons for pulling up article notes, saving and deleting notes
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);

  // when page is rerady run the initPage function
  initPage();

  function initPage() {
    // empty the article container, run AJAX request for unsaved headlines
    articleContainer.empty();
    $.get("/api/headlines?saved=true").then(function(data){
      // if there are headlines then render to the page
      if (date && data.length) {
        renderArticles(data);
      } else {
        // else render "no articles" message
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
        "<h3>Would you like to browse available articles?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        "</div>",
        "</div>"
      ].join(""));

    // append this data to the page
    articleContainer.append(emptyAlert);
  }

  // function to handle rendering note list items to notes model
  function renderNotesList(data) {
    // array of notes to render when finished
    var notesToRender = [];
    // currentNote variable to store each note temporarily
    var currentNote;
    if (!data.notes.length) {
      // if no notes, display message
      currentNote =[
        "<li class='list-group-item'>",
        "No notes for this article yet.",
        "</li>"
      ].join("");
      notesToRender.push(currentNote);
    }
    else {
      // if there are notes, loop through
      for (var i = 0; i < data.notes.length; i++) {
        // construct li element to contain noteText and delete button
        currentNote = $([
          "<li class='list-group-item note'>",
          data.notes[i].noteText,
          "<button class='btn btn-danger note-delete'>x</button>",
          "</li>"
        ].join(""));

        // store the note id on the delete button
        currentNote.children("button").data("_id", data.notes[i]._id);
        // add currentNote to notesToRender array
        notesToRender.push(currentNote);
      }
    }
    // append notesToRender to the note-container inside note model
    $(".note-container").append(notesToRender);
  }

  // function to handle deleting articles headlines
  function handleArticleDelete() {
    // grab id of article to delete from the panel element
    var articleToDelete = $(this).parents(".panel").data();
    // delete method for deleting an article / headline
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
      // if successful render list of saved articles
      if (data.ok) {
        initPage();
      }
    });
  }

  // function to handle opening and displaying the notes model
  function handleArticleNotes(){
    // grab the id of the article to get notes from panel element
    var currentArticle = $(this).parents(".panel").data();
    // grab any notes with headline / article id
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      // construct initial html to add to notes modal
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes For Article: ",
        currentArticle._id,
        "</h4>",
        "<hr />",
        "ul class='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
        "<button class='btn btn-success save'>Save Note</button>",
        "</div>"
      ].join("");

      // add formatted html to note modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var NoteData = {
        _id: currentArticle._id,
        notes:data || []
      };
      // for when trying to add a new note
      $(".btn.save").data("article", noteData);
      // populate the note html inside of the modal
      renderNotesList(noteData);
    });
  }

  // function handles what happens when user tries to save a new note for articles
  function handleNoteSave() {
    // set variable to hold formatted data about note
    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();
    // if data is typed in note input field, post it to api/notes route
    if (newNote) {
      noteData = {
        _id: $(this).data("article")._id,
        noteText: newNote
      };
      // post data to notes toure and send formatted noteData
      $.post("/api/notes", noteData).then(function() {
        // close model when done
        bootbox.hideAll();
      });
    }
  }

  // function handles deletion of notes
  function handleNoteDelete(){
    // grab id of the note user wants to delete
    var noteToDelete = $(this).data("_id");
    // delete request to api/notes with id of the note being deleted as a paramater
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      // hide modal when done
      bootbox.hideAll();
    });
  }
});