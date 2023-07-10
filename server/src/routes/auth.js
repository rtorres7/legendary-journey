const express = require("express");
const router = express.Router();
const auth = require('../services/auth');
const {KiwiStandardResponsesExpress} = require('@kiwiproject/kiwi-js');

router.get('/login', auth.passport.authenticate('oauth2', {
  scope: ['openid', 'profile', 'roles', 'email']
}));

router.get('/callback', auth.passport.authenticate('oauth2', {
  failureRedirect: '/auth/login',
  successRedirect: '/'
}));

router.get('/profile', (req, res) => {
  res.json(req.user);
});

router.delete('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      console.warn('There was a problem logging out', error);
      KiwiStandardResponsesExpress.standardErrorResponse(500, error.message, res);
      return;
    }

    res.send(204);
  });
});

module.exports = router;
