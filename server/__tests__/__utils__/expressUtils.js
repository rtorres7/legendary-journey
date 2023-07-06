const express = require("express");

function setupApp(rootPath, router) {
  const app = express();
  app.use(express.json());
  app.use(rootPath, router);

  return app;
}

function setupAppWithUser(rootPath, router, user) {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.user = user;
    next();
  });
  app.use(rootPath, router);

  return app;
}

module.exports = {
  setupApp,
  setupAppWithUser
}
