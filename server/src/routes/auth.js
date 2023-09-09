const express = require("express");
const router = express.Router();
const auth = require("../services/auth");
const { KiwiStandardResponsesExpress } = require("@kiwiproject/kiwi-js");
const { config } = require("../config/config");

router.get(
  "/auth/login",
  auth.passport.authenticate("oauth2", {
    /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Checks for user being authenticated and if no redirects to OAuth provider'
   */

    scope: config.oauth.scope,
  }),
);

router.get(
  "/auth/callback",
  auth.passport.authenticate("oauth2", {
    /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Callback for the OAuth provider and sets the user as logged in or redirects to login again'
   */

    failureRedirect: "/auth/login",
    successRedirect: "/",
  }),
);

router.get("/auth/profile", (req, res) => {
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Returns the logged in user information'
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/User'
      }
    }
   */
  console.log("Inside auth/profile");
  console.log("req.user", req.user);
  res.json(req.user);
});

router.delete("/auth/logout", (req, res) => {
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Logs out the user'
    #swagger.responses[204] = {
      schema: {

      }
    }
    #swagger.responses[500] = {
      schema: {
        $ref: '#/definitions/StandardError'
      }
    }
   */

  req.logout((error) => {
    if (error) {
      console.warn("There was a problem logging out", error);
      KiwiStandardResponsesExpress.standardErrorResponse(
        500,
        error.message,
        res,
      );
      return;
    }

    res.sendStatus(204);
  });
});

module.exports = router;
