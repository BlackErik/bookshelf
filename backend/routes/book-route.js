const express = require("express");
const bookModel = require("../schema/book-schema");
let router = express.Router();

router.get("", async (req, res) => {
  let books;
  try {
    books = await bookModel.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({
      message: "could not get /books",
      error: err,
    });
  }
});

router.get("/:isbn", async (req, res) => {
  let book;
  try {
    book = await bookModel.findOne({ isbn: req.params.isbn });
  } catch (err) {
    res.status(404).json({ message: "couldn't find book" });
  }
  res.status(200).json(book);
});

router.get("/random", async (req, res) => {
  let books;
  try {
    books = await bookModel.find();
  } catch (err) {
    res.status(404).json({ message: "couldn't find random book" });
    return;
  }
  res.status(200).json(books);
});

module.exports = router;
