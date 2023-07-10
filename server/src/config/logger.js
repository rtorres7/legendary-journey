const winston = require("winston");
const config = require("./config");

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  // https://github.com/winstonjs/winston
  // level: config.env === 'development' ? 'debug' : 'info',
  // error warn info http verbose debug silly
  level: 'info', // config.mxs.env === 'container' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    ['development', 'test'].some(i => i === config.env) ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["info"],
    }),
  ],
});

module.exports = logger;
