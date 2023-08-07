const { logger } = require("../config/logger");

export const handleMongooseError = (msg, error) => {
  if (error) {
    if (process.env.NODE_ENV === 'test') {
      logger.warn(msg, error);
    } else {
      logger.error(msg, error);
    }
  }
};

export default handleMongooseError;
