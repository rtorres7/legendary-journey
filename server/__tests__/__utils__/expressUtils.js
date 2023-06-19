const express = require("express");

function setupApp(rootPath, router) {
  const app = express();
  app.use(express.json());
  app.use(rootPath, router);

  return app;
}

module.exports = {
  setupApp,
}
