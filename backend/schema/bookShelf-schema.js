const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  user_id: {
    type: String,
  },
  comment: {
    type: String,
    required: true,
  },
  bookshelf_id: {
    type: String,
  },
  username: {
    type: String,
  },
});

const bookShelfSchema = new mongoose.Schema({
  books: {
    type: [String],
  },
  user_id: {
    type: String,
  },
  public: {
    type: Boolean,
    default: false,
  },
  posts: {
    // type: [mongoose.Schema.Types.Mixed],
    type: [postSchema],
    required: false,
    default: [],
  },
});

const BookShelf = mongoose.model("BookShelf", bookShelfSchema);
const Post = mongoose.model("Post", postSchema);

module.exports = { BookShelf, Post };
