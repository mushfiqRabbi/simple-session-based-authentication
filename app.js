const express = require("express");
const session = require("express-session");
const passport = require("passport");
const initPassport = require("./passport_config");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);

async function getUserByName(username) {
  const users = await readFile(path.join(__dirname, "/users.json"), {
    encoding: "utf8",
  });
  const user = JSON.parse(users).find((user) => user.username === username);
  return user;
}
async function getUserById(id) {
  const users = await readFile(path.join(__dirname, "/users.json"), {
    encoding: "utf8",
  });
  const user = JSON.parse(users).find((user) => user.id === id);
  return user;
}

initPassport(passport, getUserByName, getUserById);

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
