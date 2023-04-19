const LocalStrategy = require("passport-local");
const User = require("./models/userModel");
const bcrypt = require("bcrypt");

module.exports = (passport) => {
  const verifyCallback = async (username, password, done) => {
    const user = await User.findOne({ email: username });
    if (user) {
      const matchPassword = await bcrypt.compare(password, user.password);
      if (matchPassword) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } else {
      done(null, false);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, verifyCallback));
  passport.serializeUser((user, done) => {
    return done(null, user.email);
  });
  passport.deserializeUser((userEmail, done) => {
    (async () => {
      const user = await User.findOne({ email: userEmail });
      return done(null, user);
    })();
  });
};
