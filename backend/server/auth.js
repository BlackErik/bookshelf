//might need to change env setup when its actualy running
require("dotenv").config({ path: "../../.env" });
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../schema/user-schema");
const bcrypt =require('bcrypt')

//google strategy and create user
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_AUTH_REDIRECT_URL,
  }, async (accessToken, refreshToken, profile, done) =>  {
    const hashedProfileId = await bcrypt.hash(profile.id, 10);
    const newUser = {
      google_id: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
      password: hashedProfileId,
      img: profile.photos[0].value
    }
    let user;
    try {
      user = await User.findOne({ google_id: profile.id });
      if (user) {
        return done(null, user);
      } else {
        user = await User.create(newUser)
        return done(null, false)
      }
    } catch (err) {
      return done(err);
    }
  }
));

//local
passport.use(
  new LocalStrategy(async (email, password, done) => {
    let user;
    try {
      user = await User.findOne({ email: email });
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false)
      }
    } catch (err) {
      return done(err);
    }
  })
);

//runs in server
const setUpAuth = function (app) {
  app.use(passport.initialize());
  app.use(passport.authenticate("session"));

  passport.serializeUser(function (user, cb) {
    cb(null, {
      id: user._id,
      username: user.username,
      email: user.email,
    });
  });
  passport.deserializeUser(function (user, cb) {
    return cb(null, user);
  });

  app.post("/session", passport.authenticate("local"), (req, res) => {
    res.status(201).json({
      message: "successfully create session",
      username: req.user.username,
      email: req.user.email,
    });
  });

  app.get("/session", (req, res) => {
    if (!req.user) {
      res.status(401).json({ message: "unauthenticated" });
      return;
    }
    res
      .status(200)
      .json({ message: "authenticated", username: req.user.username });
  });

  //google
  app.get("/auth/google", passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/books','email','profile']}));

  app.get('/auth/google/callback', 
    passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
      if (!req.user) {
        res.status(401).json({ message: "unauthenticated" });
        return;
      }
      res.status(200).json({ message: "Authenticated! Close this window and refresh the webpage" });
    }
  );
};


module.exports = setUpAuth;
