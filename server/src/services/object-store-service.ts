// const constant = require("../util/constant.js");
import { BucketItem, BucketItemFromList, BucketItemStat, Client, ItemBucketMetadata, UploadedObjectInfo } from 'minio';
import { Readable } from 'stream';
import config from '../config/config';

export class ObjectStoreService {
  private static minioClient: Client;

  constructor() {}

  /**
   * Minio.Client
   */
  getClient(): Client {
    if (ObjectStoreService.minioClient == null) {
      // logger.info('ObjectStoreService.getClient:  connecting...');
      ObjectStoreService.minioClient = new Client({
        endPoint: config.minio.endPoint,
        port: config.minio.port,
        useSSL: config.minio.useSsl,
        accessKey: config.minio.accessKey,
        secretKey: config.minio.secretKey,
      });
      // logger.info('ObjectStoreService.getClient:  connected');
    }
    return ObjectStoreService.minioClient;
  }

  /**
   * Minio.Client.makeBucket(bucketName: string, region?: Region, makeOpts?: MakeBucketOpt): Promise<void>
   */
  async makeBucket(bucketName: string): Promise<void> {
    return this.getClient().makeBucket(bucketName);
    // .then(() => logger.info(`ObjectStoreService.makeBucket:  created bucket ${bucketName}`))
    // .catch((error) => logger.error("ObjectStoreService.makeBucket:", error));
  }

  /**
   * Minio.Client.listBuckets(): Promise<BucketItemFromList[]>
   */
  async listBuckets(): Promise<BucketItemFromList[]> {
    return this.getClient().listBuckets();
  }

  /**
   * Minio.Client.bucketExists(bucketName: string): Promise<boolean>
   */
  async bucketExists(bucketName: string): Promise<boolean> {
    return this.getClient().bucketExists(bucketName);
  }

  /**
   * Minio.Client.removeBucket(bucketName: string): Promise<void>
   */
  async removeBucket(bucketName: string): Promise<void> {
    return this.getClient().removeBucket(bucketName);
    // .then(() => logger.info(`ObjectStoreService.removeBucket:  removed bucket ${bucketName}`))
    // .catch((error) => logger.error("ObjectStoreService.removeBucket:", error));
  }

  /**
   * Minio.Client.listObjects(bucketName: string, prefix?: string, recursive?: boolean): BucketStream<BucketItem>
   */
  async listObjects(bucketName: string): Promise<BucketItem[]> {
    const bucketStream = this.getClient().listObjects(bucketName); // BucketStream<BucketItem>
    // .catch((error) => logger.error("ObjectStoreService.listObjects:", error));
    return new Promise((resolve, reject) => {
      const data = [];
      bucketStream.on('data', (obj) => data.push(obj));
      bucketStream.on('error', (err) => reject(err));
      bucketStream.on('end', () => resolve(data));
    });
  }

  /**
   * Minio.Client.statObject(bucketName: string, objectName: string): Promise<BucketItemStat>
   */
  async statObject(bucketName: string, objectName: string): Promise<BucketItemStat> {
    return this.getClient().statObject(bucketName, objectName);
  }

  /**
   * Minio.Client.getObject(bucketName: string, objectName: string): Promise<ReadableStream>
   * @return {Promise<ReadableStream>}
   */
  async getObject(bucketName: string, objectName: string): Promise<NodeJS.ReadableStream> {
    return this.getClient().getObject(bucketName, objectName);
  }

  /**
   * Minio.Client.putObject(bucketName: string, objectName: string, stream: ReadableStream | Buffer | string, metaData?: ItemBucketMetadata): Promise<UploadedObjectInfo>
   */
  async putObject(bucketName: string, objectName: string, stream: Readable | Buffer | string, metaData?: ItemBucketMetadata): Promise<UploadedObjectInfo> {
    return this.getClient().putObject(bucketName, objectName, stream, metaData);
  }

  /**
   * Minio.Client.removeObject(bucketName: string, objectName: string, removeOpts?: RemoveOptions): Promise<void>
   */
  async removeObject(bucketName: string, objectName: string): Promise<void> {
    return this.getClient().removeObject(bucketName, objectName);
  }
}

export default ObjectStoreService;