// const constant = require("../util/constant.js");
import { Request } from "express";
import {
  BucketItem,
  BucketItemFromList,
  BucketItemStat,
  Client,
  ItemBucketMetadata,
  UploadedObjectInfo,
} from "minio";
import multer from "multer";
import crypto from "crypto";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";

import { KiwiPreconditions } from "@kiwiproject/kiwi-js";
import { config } from "../config/config";
import { logger } from "../config/logger";

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
        logger.info("ObjectStoreService.makeBucket:  bucketName:%s", bucketName);
        return;
      });
  }

  /** Minio.Client.listBuckets(): Promise<BucketItemFromList[]> */
  async listBuckets(): Promise<BucketItemFromList[]> {
    return this.getClient()
      .listBuckets()
      .then((list) => {
        logger.info('ObjectStoreService.listBuckets:  ' + list.map(i => i.name).join(", "));
        logger.info("ObjectStoreService.listBuckets:  buckets:%s", list.map((i) => i.name).join(", "));
        return list;
      });
  }

  /** Minio.Client.bucketExists(bucketName: string): Promise<boolean> */
  async bucketExists(bucketName: string): Promise<boolean> {
    return this.getClient()
      .bucketExists(bucketName)
      .then((exists) => {
        logger.info("ObjectStoreService.bucketExists:  bucketName:%s, exists:%s", bucketName, exists);
        return exists;
      });
  }

  /** Minio.Client.removeBucket(bucketName: string): Promise<void> */
  async removeBucket(bucketName: string): Promise<void> {
    return this.getClient()
      .removeBucket(bucketName)
      .then(() => {
        logger.info("ObjectStoreService.removeBucket:  bucketName:%s", bucketName);
        return;
      });
  }

  /** Minio.Client.listObjects(bucketName: string, prefix?: string, recursive?: boolean): BucketStream<BucketItem> */
  async listObjects(bucketName: string): Promise<BucketItem[]> {
    const bucketStream = this.getClient().listObjects(bucketName); // BucketStream<BucketItem>
    // .catch((error) => logger.error("ObjectStoreService.listObjects:", error));
    return new Promise((resolve, reject) => {
      const data = [];
      bucketStream.on("data", (obj) => data.push(obj));
      bucketStream.on("error", (err) => reject(err));
      bucketStream.on("end", () => {
        logger.info("ObjectStoreService.listObjects:  bucketName:%s, count:%d", bucketName, data.length);
        return resolve(data);
      });
    });
  }

  /** Minio.Client.statObject(bucketName: string, objectName: string): Promise<BucketItemStat> */
  async statObject(
    bucketName: string,
    objectName: string,
  ): Promise<BucketItemStat> {
    objectName = this.sanitize(objectName);
    return this.getClient()
      .statObject(bucketName, objectName)
      .then((stats) => {
        logger.info("ObjectStoreService.statObject:  bucketName:%s, objectName:%s, stats:%j", bucketName, objectName, stats);
        return stats;
      })
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  }

  /** Minio.Client.getObject(bucketName: string, objectName: string): Promise<NodeJS.ReadableStream> */
  async getObject(
    bucketName: string,
    objectName: string,
  ): Promise<NodeJS.ReadableStream> {
    objectName = this.sanitize(objectName);
    return this.getClient()
      .getObject(bucketName, objectName)
      .then((stream) => {
        logger.info("ObjectStoreService.getObject:  bucketName:%s, objectName:%s", bucketName, objectName);
        return stream;
      })
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  }

  /** Minio.Client.putObject(bucketName: string, objectName: string, stream: ReadableStream | Buffer | string, metaData?: ItemBucketMetadata): Promise<UploadedObjectInfo> */
  async putObject(
    bucketName: string,
    objectName: string,
    stream: Readable | Buffer | string,
    metaData?: ItemBucketMetadata,
  ): Promise<UploadedObjectInfo> {
    objectName = this.sanitize(objectName);
    return this.getClient()
      .putObject(bucketName, objectName, stream, metaData)
      .then((uploadedObjectInfo) => {
        logger.info("ObjectStoreService.putObject:  bucketName:%s, objectName:%s, metadata:%j, uploadedObjectInfo:%j", bucketName, objectName, metaData, uploadedObjectInfo);
        return uploadedObjectInfo;
      });
  }

  /** Minio.Client.removeObject(bucketName: string, objectName: string, removeOpts?: RemoveOptions): Promise<void> */
  async removeObject(bucketName: string, objectName: string): Promise<void> {
    objectName = this.sanitize(objectName);
    return await this.getClient()
      .removeObject(bucketName, objectName)
      .then(() => {
        logger.info("ObjectStoreService.removeObject:  bucketName:%s, objectName:%s", bucketName, objectName);
      })
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  }

  buildUpload(bucket: string, prefix = ""): multer.Multer {
    const engine = new ObjectStorageEngine(this, bucket, prefix);
    return multer({ storage: engine });
  }

  /**
   * @see {@link https://github.com/Advanon/sanitize-s3-objectkey/}
   * @param objectName 
   */
  public sanitize(objectName: string): string {
    const SAFE_CHARACTERS = /[^0-9a-zA-Z! _\\.\\*'\\(\\)\\\-/]/g;
    const sanitized = objectName.replace(SAFE_CHARACTERS, '').trim().replace(/ /g, '-');
    if (objectName !== sanitized) {
      logger.warn("ObjectStoreService.sanitize:  objectName:%s, sanitized:%s", objectName, sanitized);
    }
    return sanitized;
  }
}

/**
 * @see Express.Multer.File
 * @see Minio.UploadedObjectInfo
 */
type PartialMulterFile = Pick<Express.Multer.File, 'fieldname' | 'originalname' | 'encoding' | 'mimetype'>;
export interface FileUploadedObjectInfo extends PartialMulterFile, UploadedObjectInfo {
  /*
  Express.Multer.File
    fieldname: "file",
    originalname: "article.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
  Minio.UploadedObjectInfo
    etag: "180b9159a3d82185c1b16a7049757420",
    versionId: "1
  */
   attachmentId: string; // 35e23a5a-9441-4450-b722-52bc8d732418
   storage: string; // "minio",
   bucketName: string; // "attachments",
   objectName: string; // "article.jpg-12345678",
   size: number; // 58251,
   visible: boolean; // ?is_visible=false
}

/**
 * moved from object-storage-engine
 */
export class ObjectStorageEngine implements multer.StorageEngine {
  service: ObjectStoreService;
  bucketName: string;
  prefix: string;

  constructor(service: ObjectStoreService, bucketName: string, prefix = "") {
    this.service = service;
    this.bucketName = bucketName;
    this.prefix = "";
    if (prefix) {
      if (prefix.endsWith("/")) {
        this.prefix = prefix;
      } else {
        this.prefix = prefix + "/";
      }
    }
  }

  async _handleFile(req: Request, file: Express.Multer.File, cb: (error?: any, info?: FileUploadedObjectInfo) => void): Promise<void> {
    KiwiPreconditions.checkArgumentDefined(req.params.productNumber);
    const productNumber = req.params.productNumber;
    // logger.info("ObjectStorageEngine._handleFile:  productNumber:%s, file:%j", productNumber, file);
    
    const bucketExists = await this.service.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.service.makeBucket(this.bucketName);
    }
    
    const attachmentId: string = uuidv4();
    const objectName = `${this.prefix}${productNumber}/${file.originalname}-${attachmentId.substr(-12)}`;
    const uploadedObjectInfo = await this.service.putObject(this.bucketName, objectName, file.stream, {"content-type": file.mimetype });
    const bucketItemStat = await this.service.statObject(this.bucketName, objectName);
    const visible = req.query.is_visible ? req.query.is_visible !== "false" : true;
    
    const fileUploadedObjectInfo = {
      ...file,
      ...uploadedObjectInfo,
      storage: "minio",
      bucketName: this.bucketName,
      objectName,
      size: bucketItemStat.size,
      visible,
      attachmentId,
    };
    logger.info("ObjectStorageEngine._handleFile:  fileUploadedObjectInfo:%j", fileUploadedObjectInfo);
    cb(null, fileUploadedObjectInfo);
  }

  async _removeFile(req: Request, file: Express.Multer.File, cb: (error: Error | null) => void,): Promise<void> {
    // const objectName = this.sanitize(file.objectName);
    logger.info("ObjectStorageEngine._removeFile:  file:%j", file);
    // await this.service.removeObject(this.bucket, objectName);
    cb(null);
  }
}

export default ObjectStoreService;
