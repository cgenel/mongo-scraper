// require mongoose
var mongoose = require("mongoose");

// create schema with mongoose.schema function
var Schema = mongoose.Schema;

// create new schema with headline id to attach notes to specefic articles
var noteSchema = new Schema({

  _headlineId: {
    type: Schema.Types.ObjectId,
    ref: "Headline"
  },

  date: String,
  noteText: String
});

// create note model
var Note = mongoose.model("Note", noteSchema);

module.exports = Note;