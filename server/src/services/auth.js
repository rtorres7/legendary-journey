const passport = require('passport');
const OAuthStrategy = require('passport-oauth2');
const jwt = require("jsonwebtoken");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, obj);
});

passport.use(new OAuthStrategy({
  issuer: `${process.env.MXS_BASE_URI}/realms/mxms`,
  authorizationURL: `${process.env.MXS_BASE_URI}/realms/mxms/protocol/openid-connect/auth`,
  tokenURL: `${process.env.MXS_BASE_URI}/realms/mxms/protocol/openid-connect/token`,
  userInfoURL: `${process.env.MXS_BASE_URI}/realms/mxms/protocol/openid-connect/userinfo`,
  clientID: process.env.MXS_OAUTH_ID,
  clientSecret: process.env.MXS_OAUTH_SECRET,
  callbackURL: `${process.env.MXS_BASE_URI}/auth/callback`,
  scope: ['openid', 'profile', 'roles'],
}, (accessToken, refreshToken, profile, cb) => {
  console.log('accessToken', accessToken);
  console.log('refreshToken', refreshToken);
  console.log('profile', profile);

  try {
    const payload = jwt.decode(accessToken);
    console.log('JWT payload', payload);

    // TODO: We need to not assume there are any roles set
    const userRoles = payload.resource_access['maximus'].roles;
    console.log('userRoles', userRoles);
  } catch (error) {
    console.error('Could not decode access token', error);
    return cb(error, null);
  }

  return cb(null, profile);
}));

const OPEN_PATHS = [
  'login'
]
function ensureAuthenticated(req, res, next) {
  const fullPath = req.baseUrl + req.path;

  const isOpen = OPEN_PATHS.filter(path => fullPath.includes(path)).length > 0;

  if (isOpen || req.isAuthenticated()) {
    return next();
  }

  res.redirect('/auth/login');
}

module.exports = {
  passport,
  ensureAuthenticated,
}
