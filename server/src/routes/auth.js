const express = require("express");
const router = express.Router();
const auth = require('../services/auth');
const {KiwiStandardResponsesExpress} = require('@kiwiproject/kiwi-js');

router.get('/login', auth.passport.authenticate('oauth2'));
router.get('/callback', (req, res, next) => {
  auth.passport.authenticate('oauth2', (error, user) => {
    if (error || !user) {
      console.warn('User is not authorized', user, error);
      KiwiStandardResponsesExpress.standardUnauthorizedResponse('Unauthorized', res);
      return;
    }

    req.logIn(user, (error) => {
      if (error) {
        console.warn('User is not authorized', user, error);
        KiwiStandardResponsesExpress.standardUnauthorizedResponse('Unauthorized', res);
        return;
      }

      res.redirect('/');
    })(req, res, next);
  });
});

router.get('/profile', (req, res) => {
  res.send(`Hello, user profile: ${JSON.stringify(req.user, null, 2)}`);
});

router.delete('/logout', (req, res) => {
  req.logout((error) => {
    console.warn('There was a problem logging out', error);
    KiwiStandardResponsesExpress.standardErrorResponse(500, error.message, res);
  });
});

module.exports = router;
