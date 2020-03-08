// require mongoose
var mongoose = require("mongoose");

// create schema with mongoose.schema function
var Schema = mongoose.Schema;

// create new schema that will require unique headline and summary
var headlineSchema = new Schema({

  headline: {
    type: String,
    required: true,
    unique: true
  },

  summary: {
    type: String,
    required: true
  },

  date:String,
  saved: {
    type: Boolean,
    default: false
  }
});

// create headline model
var Headline = mongoose.model("Headline", headlineSchema);

module.exports = Headline;