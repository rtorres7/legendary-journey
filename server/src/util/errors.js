import { logger } from "../config/logger";

const handleMongooseError = (msg, error) => {
  if (error) {
    if (process.env.NODE_ENV === 'test') {
      logger.info(msg, error);
    } else {
      logger.error(msg, error);
    }
  }
};

export default {
  handleMongooseError
};
