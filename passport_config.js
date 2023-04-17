const LocalStrategy = require("passport-local");

module.exports = (passport, getUserByName, getUserById) => {
  const verifyCallback = async (username, password, done) => {
    try {
      const user = await getUserByName(username);
      console.log(user);
      if (!user) {
        return done(null, false);
      }
      if (user && user.password !== password) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return console.log(error.message);
    }
  };

  passport.use(new LocalStrategy(verifyCallback));
  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });
  passport.deserializeUser((userId, done) => {
    (async () => {
      const user = await getUserById(userId);
      return done(null, user);
    })();
  });
};
