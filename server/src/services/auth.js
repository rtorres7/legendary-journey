const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require('crypto');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({ id, }).exec();
  done(null, user);
});

passport.use(new OAuth2Strategy({
  authorizationURL: `${process.env.MXS_BASE_URI}/realms/mxms/protocol/openid-connect/auth`,
  tokenURL: `http://keycloak:8080/realms/mxms/protocol/openid-connect/token`,
  clientID: process.env.MXS_OAUTH_ID,
  clientSecret: process.env.MXS_OAUTH_SECRET,
  callbackURL: `${process.env.MXS_BASE_URI}/api/auth/callback`,
  scope: ['openid', 'profile', 'roles'],
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, cb) => {
  console.log('accessToken', accessToken);
  console.log('refreshToken', refreshToken);
  console.log('profile', profile);

  const dn = findDN(req, accessToken, profile);

  console.log('Found dn: ', dn);

  const user = await findUser(dn);
  if (user === undefined || user === null) {
    // TODO: Deny access or create user?
    return cb(null, false, 'Unable to find user');
  }

  console.log('User', user);
  return cb(null, user);

}));

function findDN(req, accessToken, profile) {
  const certHeader = req.get('X-SSL-CLIENT-CERT');

  if (certHeader !== undefined && certHeader !== '') {
    const cert = new crypto.X509Certificate(decodeURIComponent(certHeader));
    console.log('CERT info', cert);

    return cert.subject;
  }

  try {
    const jwtPayload = jwt.decode(accessToken);
    console.log('JWT Payload', jwtPayload);

    return jwtPayload.dn;
  } catch (error) {
    console.error('Could not decode access token', error);
  }

  return undefined;
}

async function findUser(dn) {
  // TODO: This needs to change to lookup the user by the dn
  return await User.findOne({}).exec();
}

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
