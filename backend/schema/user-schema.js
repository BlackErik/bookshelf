const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  google_id: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  img: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  // username:int for friends
  // username:1 a request was made to you
  // username:2 you made a request to them
  // username:3 you are friends
  friends: {
    type: [mongoose.Schema.Types.Mixed],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
