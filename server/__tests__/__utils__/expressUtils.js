const express = require("express");

function setupApp(router) {
  const app = express();
  app.use(express.json());
  app.use(router);

  return app;
}

function setupAppWithUser(router, user) {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.user = user;
    next();
  });
  app.use(router);

  return app;
}

module.exports = {
  setupApp,
  setupAppWithUser
}
