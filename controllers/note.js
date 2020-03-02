// controller for notes
// bring in 'Note' model and 'makeDate' function
var Note = require("../models/Note");
var makeDate = require("../scripts/date");

module.exports = {

  // grab all notes associated with articles
  get: function(data, cb) {
    Note.find({ _headlineId: data._id}, cb);
  },

  // save function to take in user data and callback function
  save: function(data, cb) {
    var newNote = {
      _headlineId: data._id,
      date: makeDate(),
      noteText: data.noteText
    };

    // take note and create newNote
    Note.create(newNote, function (err, doc) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(doc);
        cb(doc);
      }
    });
  },

  // delete function so users can remove notes as well
  delete: function(data, cb) {
    Note.remove({_id: data._id}, cb);
  }
};