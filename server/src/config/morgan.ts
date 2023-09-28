import { IncomingMessage, ServerResponse } from "http";
import morgan from "morgan";
import config from "./config";
import logger from "./logger";

morgan.token(
  "message",
  (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & Record<"locals", any>,
  ) => res.locals.errorMessage || "",
);

const getIpFormat = () =>
  config.mxs.env !== "container" ? ":remote-addr - " : "";
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

export const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

export const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});
