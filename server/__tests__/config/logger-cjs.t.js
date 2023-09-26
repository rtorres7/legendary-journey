const { logger } = require("../../src/config/logger");

describe("logger load via require", () => {
  it("should log messages", () => {
    logger.info("logger info message");
    logger.warn("logger warn message");
    logger.error("logger error message");
  });
});
