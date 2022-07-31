const express = require("express");
const User = require("../schema/user-schema");

let router = express.Router();

router.get("", async (req, res) => {
  let friends;
  try {
    friends = await User.findOne({ _id: req.user.id });

    res.status(200).json(friends.friends);
  } catch (err) {
    res.status(500).json({
      message: "failure getting friends",
      error: err,
    });
  }
});

// this is for sending a friend request
// :id would be the user you are sending the friend request to
router.patch("/send/:id", async (req, res) => {
  let possibleFriendID = req.params.id;
  if (!req.user) {
    res.status(401).json({
      message: "you gotta log in first kid",
    });
    return;
  }

  //trying to find the possible friend in the database
  let possibleFriend = {};
  let requestingUser = {};
  try {
    possibleFriend = await User.findOne({
      _id: possibleFriendID,
    });
  } catch (err) {
    res.status(500).json({
      message: "could not find possible friend",
      error: err,
    });
    return;
  }

  //trying to find yourself in the database
  try {
    requestingUser = await User.findOne({
      _id: req.user.id,
    });
    for (let i in requestingUser.friends) {
      if (requestingUser.friends[i].id == possibleFriendID) {
        res.status(400).json({
          message: "can't add friends twice",
        });
        return;
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "could not find you O_O",
      error: err,
    });
    console.log(err);
    return;
  }

  // updating possible friends friend status to 1 (a request was made to you)
  try {
    await User.findByIdAndUpdate(
      possibleFriendID,
      {
        $push: {
          friends: {
            id: requestingUser.id,
            name: requestingUser.username,
            value: 1,
          },
        },
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "couldn't update possibleFriends status",
      error: err,
    });
    return;
  }

  try {
    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $push: {
          friends: {
            id: possibleFriend.id,
            name: possibleFriend.username,
            value: 2,
          },
        },
      }
    );
  } catch (err) {
    res.status(500).json({
      message: "could not update your status",
      error: err,
    });
    return;
  }

  res.status(201).json(requestingUser);
});

// confirm request

router.patch("/accept/:id", async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      message: "not logged in",
    });
    return;
  }
  let possibleFriendID = req.params.id;

  let possibleFriend = {};
  let currentUser = {};

  try {
    possibleFriend = await User.findOne({
      _id: possibleFriendID,
    });
  } catch (err) {
    res.status(500).json({
      message: "could not find possible friend",
      error: err,
    });
    return;
  }

  try {
    currentUser = await User.findOne({
      _id: req.user.id,
    });
  } catch (err) {
    res.status(500).json({
      message: "could not find you",
      error: err,
    });
    return;
  }

  try {
    await User.findOneAndUpdate(
      { _id: possibleFriendID, "friends.name": currentUser.username },
      {
        $set: {
          "friends.$.value": 3,
        },
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "could not update possibleFriends status",
      error: err,
    });
    return;
  }

  try {
    await User.findOneAndUpdate(
      { _id: currentUser.id, "friends.name": possibleFriend.username },
      {
        $set: {
          "friends.$.value": 3,
        },
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "could not update currentUsers status",
      error: err,
    });
    return;
  }

  res.status(201).json(possibleFriend);
});

router.delete("/deny/:id", async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      message: "not logged in",
    });
    return;
  }
  let possibleFriendID = req.params.id;

  let possibleFriend = {};
  let currentUser = {};

  try {
    possibleFriend = await User.findOne({
      _id: possibleFriendID,
    });
  } catch (err) {
    res.status(500).json({
      message: "could not find possible friend",
      error: err,
    });
    return;
  }

  try {
    currentUser = await User.findOne({
      _id: req.user.id,
    });
  } catch (err) {
    res.status(500).json({
      message: "could not find you",
      error: err,
    });
    return;
  }

  try {
    await User.findOneAndUpdate(
      {
        _id: possibleFriendID,
      },
      { $pull: { friends: { name: currentUser.username } } }
    );
  } catch (err) {
    res.status(500).json({
      message: "could not update possibleFriends status",
      error: err,
    });
    return;
  }

  try {
    await User.findOneAndUpdate(
      { _id: currentUser.id },
      { $pull: { friends: { name: possibleFriend.username } } }
    );
  } catch (err) {
    res.status(500).json({
      message: "could not update currentUsers status",
      error: err,
    });
    return;
  }

  res.status(200).json(possibleFriend);
});

module.exports = router;
