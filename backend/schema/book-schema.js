const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  title: {
    type: String,
  },
  rating: {
    type: Number,
  },
  user_rating: {
    type: [Number],
  },
  average_user_rating: {
    type: Number,
  },
  authors: {
    type: String,
  },
  link: {
    type: String,
  },
  description: {
    type: String,
  },
  user_id: {
    type: [String],
  },
  isbn: {
    type: String,
  },
});

const bookModel = mongoose.model("book", bookSchema);

module.exports = bookModel;
