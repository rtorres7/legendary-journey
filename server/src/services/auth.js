const passport = require("passport");
const UserService = require("../services/user-service");
const userService = new UserService();
const keycloakStrategy = require("./keycloakStrategy");
const geoaxisStrategy = require("./geoaxisStrategy");
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

if (process.env.MXS_OAUTH_STRATEGY === "keycloak") {
  passport.use(keycloakStrategy());
} else if (process.env.MXS_OAUTH_STRATEGY === "geoaxis") {
  passport.use(geoaxisStrategy());
}

const OPEN_PATHS = ["login", "callback", "api-docs"];

function ensureAuthenticated(req, res, next) {
  if (
    process.env.MXS_ENV === "container" &&
    req.referer?.includes("api-docs")
  ) {
    return next();
  }

  const fullPath = req.baseUrl + req.path;
  const isOpen =
    OPEN_PATHS.filter((path) => fullPath.includes(path)).length > 0;

  if (isOpen || req.isAuthenticated()) {
    return next();
  }

  res.status(401).send();
}

module.exports = {
  passport,
  ensureAuthenticated,
};
