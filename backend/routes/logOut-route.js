const express = require("express");
let router = express.Router();

router.get("", (req, res) => {
  if (req.session) {
    res.clearCookie('connect.sid')
    req.session.destroy((err) => {
      if (err) {
        res.status(400).send("Unable to log out");
      } else {
        res.send("Logout successful");
      }
    });
  } else {
    res.end();
  }
});

module.exports = router;
