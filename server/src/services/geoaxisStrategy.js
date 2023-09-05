const OAuth2Strategy = require("passport-oauth2");
const jwt = require("jsonwebtoken");
const UserService = require("./user-service");
const userService = new UserService();

module.exports = function () {
  const strategy = new OAuth2Strategy(
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
      if (!user) {
        const jwtPayload = jwt.decode(accessToken);

        const newUser = await userService.createUserWithOrganization(
          {
            email: profile.email ? profile.email : "default@email.com", //TODO: potential geoaxis bug, email is not always returned
            fullName: jwtPayload.commonname,
            firstName: jwtPayload.firstname,
            lastName: jwtPayload.lastname,
            dn: dn,
            cn: jwtPayload.commonname,
            userName: jwtPayload.username,
            roles: ["wire_editor", "community_editor"], //TODO: remove this once we have an admin dashboard
            hasOrg: true,
            // ... other fields?
          },
          jwtPayload.serviceOrAgency,
        );

        console.log("User", user);
        return cb(null, newUser);
      }

      console.log("User", user);
      return cb(null, user);
    },
  );

  strategy.userProfile = function (accessToken, done) {
    this._oauth2.useAuthorizationHeaderforGET(true);
    this._oauth2.get(
      process.env.MXS_OAUTH_USER_INFO_URL,
      accessToken,
      function (err, body, res) {
        if (err) {
          return done(new Error("Failed to fetch user profile"));
        }

        var json;
        try {
          json = JSON.parse(body);
          console.log("JSON", json);
        } catch (ex) {
          return done(new Error("Failed to parse user profile"));
        }

        var profile = json;

        done(null, profile);
      },
    );
  };

  return strategy;
};

function findDN(req, accessToken, profile) {
  try {
    const jwtPayload = jwt.decode(accessToken);
    console.log("JWT Payload", jwtPayload);

    return jwtPayload.DN;
  } catch (error) {
    console.error("Could not decode access token", error);
  }

  return undefined;
}

async function findUser(dn) {
  return await userService.findByDN(dn);
}
