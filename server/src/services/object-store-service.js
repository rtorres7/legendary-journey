const constant = require("../util/constant.js");
const config = require("../config/config.js");
const logger = require("../config/logger.js");
const { Client } = require("minio");

class ObjectStoreService {
  static minioClient;

  constructor() {}

  getClient() {
    if (ObjectStoreService.minioClient == null) {
      // logger.info('ObjectStoreService.getClient:  connecting...');
      ObjectStoreService.minioClient = new Client({
        endPoint: config.minio.endpoint,
        port: config.minio.port,
        useSSL: config.minio.useSsl,
        accessKey: config.minio.accessKey,
        secretKey: config.minio.secretKey,
      });
      // logger.info('ObjectStoreService.getClient:  connected');
    }
    return ObjectStoreService.minioClient;
  }

  async listBuckets() {
    return this.getClient().listBuckets();
  }

  async makeBucket(bucketName) {
    await this.getClient().makeBucket(bucketName)
      .then(() => logger.info(`ObjectStoreService.makeBucket:  created bucket ${bucketName}`))
      .catch((error) => logger.error('ObjectStoreService.makeBucket:', error));
  }

  bucketExists(bucketName) {
    return this.getClient().bucketExists(bucketName);
  }
}

module.exports = ObjectStoreService;
