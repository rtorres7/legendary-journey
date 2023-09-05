const OAuth2Strategy = require("passport-oauth2");
const UserService = require("./user-service");
const userService = new UserService();
const crypto = require("crypto");

module.exports = function () {
  return new OAuth2Strategy(
    {
      authorizationURL: process.env.MXS_OAUTH_AUTH_URL,
      tokenURL: process.env.MXS_OAUTH_TOKEN_URL,
      clientID: process.env.MXS_OAUTH_ID,
      clientSecret: process.env.MXS_OAUTH_SECRET,
      callbackURL: process.env.MXS_OAUTH_CALLBACK_URL,
      scope: process.env.MXS_OAUTH_SCOPES.split(","),
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, cb) => {
      const dn = findDN(req, accessToken, profile);

      console.log("Found dn: ", dn);

      const user = await findUser(dn);

      // We shouldn't really hit this condition based on seeding
      if (user === undefined || user === null) {
        return cb("Unable to find user", null);
      }

      console.log("User", user);
      return cb(null, user);
    },
  );
};

function findDN(req, accessToken, profile) {
  const certHeader = req.get("X-SSL-CLIENT-CERT");

  if (certHeader !== undefined && certHeader !== "") {
    const cert = new crypto.X509Certificate(decodeURIComponent(certHeader));
    console.log("CERT info", cert);

    return cert.subject.replace(/\n/g, ",");
  }

  return undefined;
}

async function findUser(dn) {
  return await userService.findByDN(dn);
}
