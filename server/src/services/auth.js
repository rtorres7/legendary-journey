const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const jwt = require("jsonwebtoken");
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({ id, }).exec();
  done(null, user);
});

passport.use(new OAuth2Strategy({
  // issuer: `${process.env.MXS_BASE_URI}/realms/mxms`,
  authorizationURL: `${process.env.MXS_BASE_URI}/realms/mxms/protocol/openid-connect/auth`,
  tokenURL: `http://keycloak:8080/realms/mxms/protocol/openid-connect/token`,
  // userInfoURL: `${process.env.MXS_BASE_URI}/realms/mxms/protocol/openid-connect/userinfo`,
  clientID: process.env.MXS_OAUTH_ID,
  clientSecret: process.env.MXS_OAUTH_SECRET,
  callbackURL: `${process.env.MXS_BASE_URI}/api/auth/callback`,
  scope: ['openid', 'profile', 'roles'],
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, cb) => {
  console.log('accessToken', accessToken);
  console.log('refreshToken', refreshToken);
  console.log('profile', profile);

  try {
    const payload = jwt.decode(accessToken);
    console.log('JWT payload', payload);

    const user = await User.findOne({}).exec();
    console.log('User', user);
    return cb(null, user);
  } catch (error) {
    console.error('Could not decode access token', error);
    return cb(null, false, error.message);
  }
}));

const OPEN_PATHS = [
  'login',
  'callback'
]
function ensureAuthenticated(req, res, next) {
  const fullPath = req.baseUrl + req.path;

  const isOpen = OPEN_PATHS.filter(path => fullPath.includes(path)).length > 0;

  if (isOpen || req.isAuthenticated()) {
    return next();
  }

  res.status(401).send();
}

module.exports = {
  passport,
  ensureAuthenticated,
}
