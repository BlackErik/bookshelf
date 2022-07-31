const express = require("express");
const User = require("../schema/user-schema");
const { BookShelf } = require("../schema/bookShelf-schema");
let router = express.Router();
const bcrypt = require("bcrypt");

router.post("", async (req, res) => {
  let user = {};
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      friends: [],
    });
    try {
      await BookShelf.create({
        books: [],
        user_id: user._id,
        public: false,
        posts: [],
      });
    } catch (err) {
      res.status(500).json({
        message: "couldn't create default bookshelf",
        error: err,
      });
      return;
    }
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      message: "post request failed to create user",
      error: err,
    });
    console.log(err);
  }
});

router.get("", async (req, res) => {
  let listOfUsers;
  try {
    listOfUsers = await User.find(
      {},
      {
        password: 0,
        email: 0,
        fullname: 0,
        shared_id: 0,
        public: 0,
        friends: 0,
      }
    );
    res.status(200).json(listOfUsers);
  } catch (err) {
    res.status(500).json({ message: "could not get users" });
  }
});

router.get("/:name", async (req, res) => {
  let userName = req.params.name;
  let user;
  try {
    user = await User.find(
      { username: userName },
      {
        password: 0,
        email: 0,
        fullname: 0,
        shared_id: 0,
        friends: 0,
        google_id: 0,
      }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "could not get users" });
  }
});

module.exports = router;
