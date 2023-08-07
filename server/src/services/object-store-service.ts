// const constant = require("../util/constant.js");
import { Request } from 'express';
import _ from 'lodash';
import { BucketItem, BucketItemFromList, BucketItemStat, Client, ItemBucketMetadata, UploadedObjectInfo } from 'minio';
import multer from 'multer';
import { Readable } from 'stream';
import { v4 as uuidv4 } from "uuid";

import config from '../config/config';
import logger from '../config/logger';

export class ObjectStoreService {
  private static minioClient: Client;

  /** Minio.Client */
  getClient(): Client {
    if (ObjectStoreService.minioClient == null) {
      // logger.info(`ObjectStoreService.getClient:  port:${config.minio.port}`);
      ObjectStoreService.minioClient = new Client({
        endPoint: config.minio.endPoint,
        port: config.minio.port,
        useSSL: config.minio.useSsl,
        accessKey: config.minio.accessKey,
        secretKey: config.minio.secretKey,
      });
    }
    return ObjectStoreService.minioClient;
  }

  /** Minio.Client.makeBucket(bucketName: string, region?: Region, makeOpts?: MakeBucketOpt): Promise<void> */
  async makeBucket(bucketName: string): Promise<void> {
    return this.getClient()
      .makeBucket(bucketName)
      .then(() => {
        logger.info(`ObjectStoreService.makeBucket:  created bucket:${bucketName}`);
        return;
      });
  }

  /** Minio.Client.listBuckets(): Promise<BucketItemFromList[]> */
  async listBuckets(): Promise<BucketItemFromList[]> {
    return this.getClient()
      .listBuckets()
      .then((list) => {
        logger.info('ObjectStoreService.listBuckets:  ' + list.map(i => i.name).join(", "));
        return list;
      });
  }

  /** Minio.Client.bucketExists(bucketName: string): Promise<boolean> */
  async bucketExists(bucketName: string): Promise<boolean> {
    return this.getClient()
      .bucketExists(bucketName)
      .then((exists) => {
        logger.info(`ObjectStoreService.bucketExists:  bucket:${bucketName}, exists:${exists}`);
        return exists;
      });
  }

  /** Minio.Client.removeBucket(bucketName: string): Promise<void> */
  async removeBucket(bucketName: string): Promise<void> {
    return this.getClient()
      .removeBucket(bucketName)
      .then(() => {
        logger.info(`ObjectStoreService.removeBucket:  removed bucket:${bucketName}`);
        return;
      });
  }

  /** Minio.Client.listObjects(bucketName: string, prefix?: string, recursive?: boolean): BucketStream<BucketItem> */
  async listObjects(bucketName: string): Promise<BucketItem[]> {
    const bucketStream = this.getClient().listObjects(bucketName); // BucketStream<BucketItem>
    // .catch((error) => logger.error("ObjectStoreService.listObjects:", error));
    return new Promise((resolve, reject) => {
      const data = [];
      bucketStream.on('data', (obj) => data.push(obj));
      bucketStream.on('error', (err) => reject(err));
      bucketStream.on('end', () => {
        logger.info(`ObjectStoreService.listObjects:  bucket:${bucketName}, count:${data.length}`);
        return resolve(data);
      });
    });
  }

  /** Minio.Client.statObject(bucketName: string, objectName: string): Promise<BucketItemStat> */
  async statObject(bucketName: string, objectName: string): Promise<BucketItemStat> {
    return this.getClient()
      .statObject(bucketName, objectName)
      .then((stats) => {
        logger.info(`ObjectStoreService.statObject:  bucket:${bucketName}, object:${objectName}, stats:${JSON.stringify(stats)}`);
        return stats;
      });
  }

  /** Minio.Client.getObject(bucketName: string, objectName: string): Promise<ReadableStream> */
  async getObject(bucketName: string, objectName: string): Promise<NodeJS.ReadableStream> {
    return this.getClient()
      .getObject(bucketName, objectName)
      .then((stream) => {
        logger.info(`ObjectStoreService.getObject:  bucket:${bucketName}, object:${objectName}`);
        return stream;
      });
  }

  /** Minio.Client.putObject(bucketName: string, objectName: string, stream: ReadableStream | Buffer | string, metaData?: ItemBucketMetadata): Promise<UploadedObjectInfo> */
  async putObject(bucketName: string, objectName: string, stream: Readable | Buffer | string, metaData?: ItemBucketMetadata): Promise<UploadedObjectInfo> {
    return this.getClient()
      .putObject(bucketName, objectName, stream, metaData)
      .then((uploadedObjectInfo) => {
        logger.info(`ObjectStoreService.putObject:  bucket:${bucketName}, object:${objectName}, metadata:${metaData}, uploadedObjectInfo:${JSON.stringify(uploadedObjectInfo)}`);
        return uploadedObjectInfo;
      });
  }

  /** Minio.Client.removeObject(bucketName: string, objectName: string, removeOpts?: RemoveOptions): Promise<void> */
  async removeObject(bucketName: string, objectName: string): Promise<void> {
    return this.getClient()
      .removeObject(bucketName, objectName)
      .then(() => {
        logger.info(`ObjectStoreService.removeObject:  bucket:${bucketName}, object:${objectName}`);
        return;
      });
  }

  buildUpload(bucket: string, prefix: string): multer.Multer {
    const engine = new ObjectStorageEngine(this, bucket, prefix);
    return multer({ storage: engine });
  }
}

/**
 * moved from object-storage-engine
 */
export class ObjectStorageEngine implements multer.StorageEngine {
  service: ObjectStoreService;
  bucket: string;
  prefix: string;

  constructor(service: ObjectStoreService, bucket: string, prefix: string) {
    this.service = service;
    this.bucket = bucket;
    this.prefix = prefix;
  }

  async _handleFile(req: Request, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File> & Record<string, any>) => void): Promise<void> {
    logger.info('ObjectStorageEngine._handleFile:  %O', file);
    
    const bucketExists = await this.service.bucketExists(this.bucket);
    if (!bucketExists) {
      await this.service.makeBucket(this.bucket);
    }

    const id = uuidv4();
    const path = `${this.prefix}/${id}/${file.originalname}`;
    const uploadedObject = await this.service.putObject(this.bucket, path, file.stream, { 'content-type': file.mimetype });
    const stats = await this.service.statObject(this.bucket, path);

    cb(null, {
      bucket: this.bucket,
      path,
      etag: uploadedObject.etag,
      version: uploadedObject.versionId,
      size: stats.size,
      storage: 'minio',
    });
  }

  async _removeFile(req: Request, file: Express.Multer.File, cb: (error: Error | null) => void): Promise<void> {
    logger.info('ObjectStorageEngine._removeFile:  %O', file);
    await this.service.removeObject(this.bucket, file.path);
    cb(null);
  }
}

export default ObjectStoreService;
