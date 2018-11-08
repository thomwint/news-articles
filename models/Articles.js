const mongoose = require('mongoose');

// Save a reference to the Schema constructor
const { Schema } = mongoose;

// Using the Schema constructor
const ArticleSchema = new Schema({
  headline: {
    type: String,
    required: true,
    unique: true,
  },
  summary: {
    type: String,
    required: true,
    unique: true,
  },
  link: {
    type: String,
    required: true,
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: 'Note',
  },
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model('Article', ArticleSchema);

// Export the Article model
module.exports = Article;
