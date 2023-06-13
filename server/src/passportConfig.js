const passport = require("passport");
const session = require("express-session");
var Strategy = require("passport-oauth2");
const jwt = require("jsonwebtoken");

// User serialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new Strategy(
    {
      issuer: "https://localhost:8443/realms/mxms",
      authorizationURL:
        "https://localhost:8443/realms/mxms/protocol/openid-connect/auth",
      tokenURL:
        "https://host.docker.internal:8443/realms/mxms/protocol/openid-connect/token",
      userInfoURL:
        "https://localhost:8443/realms/mxms/protocol/openid-connect/userinfo",
      clientID: "maximus",
      clientSecret: "jJjVjNLQJ9r3dTc64rt2cFwenmEeusaY",
      callbackURL: "https://localhost:8443/callback",
      scope: ["openid", "profile", "roles"],
    },
    function (accessToken, refreshToken, profile, cb) {
      // Log the access token
      console.log("accessToken is ", accessToken);

      // Log the profile
      console.log("refreshToken is ", refreshToken);

      // Log the profile
      console.log("profile is ", profile);

      let userRoles;
      try {
        const payload = jwt.decode(accessToken);

        // Log the payload
        console.log("payload is ", payload);

        userRoles = payload.resource_access["maximus"].roles; //TODO: don't assume there's any roles set
      } catch (err) {
        console.error("Could not decode access token", err);
        return done(err);
      }
      console.log("userRoles: ", userRoles);

      // Return the user profile
      return cb(null, profile);
    }
  )
);

module.exports = function (app) {
  // Passport setup
  app.use(
    session({
      secret: "keyboard cat",
      saveUninitialized: false,
      resave: false,
      cookie: { secure: false, sameSite: true }, //TODO: when we support ssl
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // User serialization
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  // Routes
  app.get("/login", passport.authenticate("oauth2"));

  app.get("/callback", function (req, res, next) {
    passport.authenticate("oauth2", function (err, user, info) {
      if (err) {
        //TODO: error handling
        res.redirect("/error");
        return;
      }
      if (!user) {
        //TODO: error handling
        res.redirect("/error");
        return;
      }
      req.logIn(user, function (err) {
        if (err) {
          //TODO: error handling
          res.redirect("/error");
          return;
        }
        res.redirect("/");
      });
    })(req, res, next);
  });

  app.get("/profile", ensureAuthenticated, function (req, res) {
    res.send("Hello, user profile: " + JSON.stringify(req.user, null, 2));
  });

  app.get("/error", function (req, res) {
    res.send("Error occurred during authentication");
  });

  // It is a good idea to use POST or DELETE requests instead of GET requests
  // for the logout endpoints, in order to prevent accidental or malicious logouts.
  app.post("/logout", function (req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }

  function ensureRole(role) {
    return function (req, res, next) {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      }
      res.redirect("/unauthorized");
    };
  }
};
