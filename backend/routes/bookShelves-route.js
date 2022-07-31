const express = require("express");
const bookModel = require("../schema/book-schema");
const User = require("../schema/user-schema");
const { BookShelf } = require("../schema/bookShelf-schema");

let router = express.Router();

router.post("", async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      message: "UNAUTHENTICATED",
    });
    return;
  }
  let book;
  try {
    let testBookInDatabase = await bookModel.findOne({
      isbn: req.body.isbn,
    });
    if (!testBookInDatabase) {
      book = await bookModel.create({
        image: req.body.image,
        title: req.body.title,
        rating: req.body.rating,
        authors: req.body.authors,
        link: req.body.link,
        description: req.body.description,
        isbn: req.body.isbn,
        user_id: [req.user.id],
      });
    } else if (testBookInDatabase) {
      book = testBookInDatabase;
      if (!book.user_id.includes(req.user.id)) {
        await bookModel.findOneAndUpdate(
          { _id: testBookInDatabase._id.toString() },
          {
            $push: { user_id: req.user.id },
          },
          { new: true }
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
  let userID = req.user.id;
  try {
    let bookshelfObject = await BookShelf.findOne({ user_id: req.user.id });
    if (!bookshelfObject) {
      await BookShelf.create({
        user_id: userID,
        books: [book._id],
        posts: [],
      });
    } else if (bookshelfObject) {
      if (bookshelfObject.books.includes(book._id)) {
        res.status(400).json({
          message: "already have book in shelf",
        });
        return;
      } else {
        let bookshelf = await BookShelf.findOneAndUpdate(
          { user_id: userID },
          {
            $push: { books: book._id },
          },
          { new: true }
        );
        res.status(200).json({
          message: bookshelf,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "could not create bookshelf or add",
      error: err,
    });
  }
});

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

router.get("/public", async (req, res) => {
  let listOfUsersAndBooks = [];
  let listOfShelves;
  try {
    listOfShelves = await BookShelf.find({ public: true });
    let currentBook;
    for (const shelf in listOfShelves) {
      let listOfBooks = [];
      let object = {};
      for (const book in listOfShelves[shelf].books) {
        currentBook = await bookModel.findOne({
          _id: listOfShelves[shelf].books[book],
        });
        listOfBooks.push(currentBook);
      }
      let username = await User.findOne({ _id: listOfShelves[shelf].user_id });
      object["username"] = username.username;
      object["books"] = shuffle(listOfBooks);
      object["user_id"] = username._id;
      listOfUsersAndBooks.push(object);
    }
    res.status(200).json(listOfUsersAndBooks);
  } catch (err) {
    res.status(500).json({
      message: "error getting public shelves",
      error: err,
    });
  }
});

router.get("/books", async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "unauthenticated" });
    return;
  }
  let id = req.user.id;
  let bookshelf;
  try {
    bookshelf = await BookShelf.findOne({ user_id: id });
    let listOfBooks = [];
    let book;
    let currentBook;
    for (book in bookshelf.books) {
      currentBook = await bookModel.findOne({
        _id: bookshelf.books[book].toString(),
      });
      listOfBooks.push(currentBook);
    }
    res.status(200).json({ listOfBooks });
  } catch (err) {
    res.status(500).json({
      message: "failed to get bookshelf from id",
    });
  }
});

router.get("/books/:id", async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "unauthenticated" });
    return;
  }
  let id = req.params.id;
  let bookshelf;
  let listOfBooks = [];
  try {
    bookshelf = await BookShelf.findOne({ user_id: id });
    let book;
    let currentBook;
    for (book in bookshelf.books) {
      currentBook = await bookModel.findOne({
        _id: bookshelf.books[book].toString(),
      });
      listOfBooks.push(currentBook);
    }
  } catch (err) {
    res.status(500).json({
      message: "failed to get bookshelf from id",
    });
    return;
  }

  res.status(200).json({ listOfBooks });
});

router.get("", async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "unauthenticated" });
    return;
  }
  let id = req.user.id;
  let bookshelf;
  try {
    bookshelf = await BookShelf.findOne({ user_id: id });
  } catch (err) {
    res.status(500).json({
      message: "failed to get bookshelf from id",
    });
  }

  for (let i in bookshelf.posts) {
    try {
      bookshelf.posts[i].user = await User.findById(
        bookshelf.posts[i].user_id,
        "-password"
      );
    } catch (err) {
      console.log("unable to get user when getting bookshelf", err);
    }
  }
  res.status(200).json({ bookshelf });
});

router.get("/:user_id", async (req, res) => {
  let userID = req.params.user_id;
  let bookshelf;
  try {
    bookshelf = await BookShelf.findOne({
      user_id: userID,
    });
  } catch (err) {
    res.status(404).json({ message: "bookshelf by id not found", error: err });
    return;
  }
  for (let i in bookshelf.posts) {
    try {
      bookshelf.posts[i].user = await User.findById(
        bookshelf.posts[i].user_id,
        "-password"
      );
    } catch (err) {
      console.log("unable to get user when getting bookshelf", err);
    }
  }
  res.status(200).json(bookshelf);
});

router.delete("/:book_id", async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "unauthenticated" });
    return;
  }
  let bookshelf;
  try {
    bookshelf = await BookShelf.findOne({ user_id: req.user.id });
  } catch (err) {
    res.status(500).json({ message: "couldn't find bookshelf", error: err });
    return;
  }
  let book;
  let index;
  try {
    for (let i in bookshelf.books) {
      if (bookshelf.books[i] == req.params.book_id) {
        book = bookshelf.books[i];
        index = i;
      }
    }
  } catch (err) {
    res.status(500).json({ message: "couldn't find book", error: err });
    return;
  }
  try {
    await BookShelf.findOneAndUpdate(
      { user_id: req.user.id },
      {
        $pull: {
          books: book,
        },
      }
    );
  } catch (err) {
    res.status(500).json({
      message: "error deleting book",
      error: err,
    });
    return;
  }
  try {
    let bookUser;
    bookUser = await bookModel.findOneAndUpdate(
      { _id: req.params.book_id },
      {
        $pull: {
          user_id: req.user.id,
        },
      }
    );
    console.log(bookUser);
  } catch (err) {
    res.status(500).json({
      message: "error deleting user from book array",
      error: err,
    });
  }
  res.status(200).json(book + index);
});

router.patch("", async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      message: "unathenticated",
    });
    return;
  }
  let id = req.user.id;

  let bookshelf;
  try {
    bookshelf = await BookShelf.findOneAndUpdate({ user_id: id }, req.body, {
      new: true,
    });

    res.status(200).json(bookshelf);
  } catch (err) {
    res.status(500).json({
      message: "error updating shelf",
      error: err,
    });
    return;
  }
});

module.exports = router;
