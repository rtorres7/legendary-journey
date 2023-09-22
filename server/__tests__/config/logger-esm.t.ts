import "jest-extended";
import logger from "../../src/config/logger";

describe("logger load via import", () => {
  it("should log messages", () => {
    logger.info("logger info message");
    logger.warn("logger warn message");
    logger.error("logger error message");
  });
});
