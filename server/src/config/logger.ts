import winston from "winston";

const colorFormat =
  process.env.NODE_ENV !== "production"
    ? winston.format.colorize()
    : winston.format.uncolorize();

export const logger = winston.createLogger({
  // https://github.com/winstonjs/winston
  // error warn info http verbose debug silly
  level: "info", // process.env.MXS_ENV === 'container' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    // winston.format.timestamp(),
    winston.format.splat(),
    colorFormat,
    winston.format.printf(({ level, message, timestamp, stack }) => {
      if (stack && level.includes("error")) {
        // colorize changes the level?
        return `${level}: ${message}\n${stack}`;
        // return `${timestamp} ${level}: ${message}\n${stack}`;
      }
      return `${level}: ${message}`;
      // return `${timestamp} ${level}: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["info"],
    }),
  ],
});

export default logger;
