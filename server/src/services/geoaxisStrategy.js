const OAuth2Strategy = require("passport-oauth2");
const jwt = require("jsonwebtoken");
const UserService = require("./user-service");
const userService = new UserService();
const { config } = require("../config/config");

module.exports = function () {
  const strategy = new OAuth2Strategy(
    {
      authorizationURL: config.oauth.authorizationURL,
      tokenURL: config.oauth.tokenURL,
      clientID: config.oauth.id,
      clientSecret: config.oauth.secret,
      callbackURL: config.oauth.callbackURL,
      scope: config.oauth.scope,
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
            roles: [
              "wire_editor",
              "community_editor",
              "special_edition_manager",
            ], //TODO: remove this once we have an admin dashboard
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
      config.oauth.userInfoURL,
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
