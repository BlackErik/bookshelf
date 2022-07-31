if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config({ path: "../../.env" });
}
const session = require("express-session");

const setUpSessionStore = function (app) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
};

module.exports = setUpSessionStore;
