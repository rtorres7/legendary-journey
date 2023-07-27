import winston from "winston";
import config from "./config";

const colorFormat = ['development', 'test'].some((i) => i === config.nodeEnv) ? winston.format.colorize() : winston.format.uncolorize();

export const logger = winston.createLogger({
  // https://github.com/winstonjs/winston
  // level: config.nodeEnv === 'development' ? 'debug' : 'info',
  // error warn info http verbose debug silly
  level: 'info', // config.mxs.env === 'container' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.splat(),
    colorFormat,
    winston.format.printf(({ level, message, timestamp, stack }) => {
      if (stack && level.includes('error')) { // colorize changes the level?
        return `${timestamp} ${level}: ${message}\n${stack}`;
      }
      return `${timestamp} ${level}: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['info'],
    }),
  ],
});

export default logger;
