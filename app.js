const express = require("express");
const session = require("express-session");
const passport = require("passport");
const initPassport = require("./passport_config");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then(() => console.log("Connected to MongoDB!"));

initPassport(passport);

const checkAuthentication = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/test" }),
    cookie: { maxAge: 1000 * 60 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

app.get("/login", (req, res) => {
  return res.send("welcome to login page");
});

app.get("/profile", checkAuthentication, (req, res) => {
  return res.send("welcome to profile");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
