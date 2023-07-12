const constant = require("../util/constant.js");
const config = require("../config/config.js");
const logger = require("../config/logger.js");
const { Client } = require("minio");

class ObjectStoreService {
  static #minioClient;

  constructor() {}

  /**
   * Minio.Client
   * @return {Client}
   */
  getClient() {
    if (ObjectStoreService.#minioClient == null) {
      // logger.info('ObjectStoreService.getClient:  connecting...');
      ObjectStoreService.#minioClient = new Client({
        endPoint: config.minio.endpoint,
        port: config.minio.port,
        useSSL: config.minio.useSsl,
        accessKey: config.minio.accessKey,
        secretKey: config.minio.secretKey,
      });
      // logger.info('ObjectStoreService.getClient:  connected');
    }
    return ObjectStoreService.#minioClient;
  }

  /**
   * Minio.Client.makeBucket(bucketName: string, region?: Region, makeOpts?: MakeBucketOpt): Promise<void>
   * @return {Promise<void>}
   */
  async makeBucket(bucketName) {
    return this.getClient().makeBucket(bucketName);
    // .then(() => logger.info(`ObjectStoreService.makeBucket:  created bucket ${bucketName}`))
    // .catch((error) => logger.error("ObjectStoreService.makeBucket:", error));
  }

  /**
   * Minio.Client.listBuckets(): Promise<BucketItemFromList[]>
   * @return {Promise<BucketItemFromList[]}
   */
  async listBuckets() {
    return this.getClient().listBuckets();
  }

  /**
   * Minio.Client.bucketExists(bucketName: string): Promise<boolean>
   * @return {Promise<Boolean>}
   */
  async bucketExists(bucketName) {
    return this.getClient().bucketExists(bucketName);
  }

  /**
   * Minio.Client.removeBucket(bucketName: string): Promise<void>
   * @return {Promise<void>}
   */
  async removeBucket(bucketName) {
    return this.getClient().removeBucket(bucketName);
    // .then(() => logger.info(`ObjectStoreService.removeBucket:  removed bucket ${bucketName}`))
    // .catch((error) => logger.error("ObjectStoreService.removeBucket:", error));
  }

  /**
   * Minio.Client.listObjects(bucketName: string, prefix?: string, recursive?: boolean): BucketStream<BucketItem>
   * @return {Promise<BucketItem[]>}
   */
  async listObjects(bucketName) {
    var bucketStream = this.getClient().listObjects(bucketName); // BucketStream<BucketItem>
    // .catch((error) => logger.error("ObjectStoreService.listObjects:", error));
    return new Promise((resolve, reject) => {
      var data = [];
      bucketStream.on("data", (obj) => data.push(obj));
      bucketStream.on("error", (err) => reject(err));
      bucketStream.on("end", () => resolve(data));
    });
  }

  /**
   * Minio.Client.statObject(bucketName: string, objectName: string): Promise<BucketItemStat>
   * @return {Promise<BucketItemStat>}
   */
  async statObject(bucketName, objectName) {
    return this.getClient().statObject(bucketName, objectName);
  }

  /**
   * Minio.Client.getObject(bucketName: string, objectName: string): Promise<ReadableStream>
   * @return {Promise<ReadableStream>}
   */
  async getObject(bucketName, objectName) {
    return this.getClient().getObject(bucketName, objectName);
  }

  /**
   * Minio.Client.putObject(bucketName: string, objectName: string, stream: ReadableStream | Buffer | string, metaData?: ItemBucketMetadata): Promise<UploadedObjectInfo>
   * @return {Promise<UploadedObjectInfo>}
   */
  async putObject(bucketName, objectName, stream) {
    return this.getClient().putObject(bucketName, objectName, stream);
  }

  /**
   * Minio.Client.removeObject(bucketName: string, objectName: string, removeOpts?: RemoveOptions): Promise<void>
   * @param {String} bucketName
   * @param {String} objectName
   * @return {Promise<void>}
   */
  async removeObject(bucketName, objectName) {
    return this.getClient().removeObject(bucketName, objectName);
  }
}

module.exports = ObjectStoreService;
