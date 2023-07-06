const constant = require("../util/constant.js");
const config = require("../config/config");
const logger = require("../config/logger");
const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: config.minio.endpoint,
  port: config.minio.endpoint,
  useSSL: config.minio.useSsl,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey,
});

class ObjectStoreService {}

module.exports = ObjectStoreService;
