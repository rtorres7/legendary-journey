const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)

      return config;
    },
  },
});
