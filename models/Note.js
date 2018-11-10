const mongoose = require('mongoose');

// Save a reference to the Schema constructor
const { Schema } = mongoose;

// Using the Schema constructor
const NoteSchema = new Schema({
  body: String,
});

// This creates our model from the above schema, using mongoose's model method
const Note = mongoose.model('Note', NoteSchema);

// Export the Note model
module.exports = Note;
