import { Request } from 'express';
import _ from 'lodash';
import { StorageEngine } from 'multer';

import logger from '../config/logger';
import { ObjectStoreService } from '../services/object-store-service';

export class ObjectStorageEngine implements StorageEngine {
  service: ObjectStoreService;
  bucket: string;
  prefix: string;

  constructor(opts: Record<string, string>) {
    this.service = new ObjectStoreService();
    this.bucket = opts.bucket;
    this.prefix = opts.prefix;
  }

  async _handleFile(req: Request, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File> & Record<string, any>) => void) {
    logger.info("ObjectStorageEngine._handleFile:  " + JSON.stringify(_.pick(file, ['originalname', 'encoding', 'mimetype', 'size', 'destination', 'filename', 'path'])));

    const bucketExists = await this.service.bucketExists(this.bucket);
    if (!bucketExists) {
      await this.service.makeBucket(this.bucket);
    }

    const uploadedObject = await this.service.putObject(this.bucket, `${this.prefix}/${file.originalname}`, file.stream, { 'content-type': file.mimetype });
    const stats = await this.service.statObject(this.bucket, `${this.prefix}/${file.originalname}`);

    cb(null, {
      bucket: this.bucket,
      path: `${this.prefix}/${file.originalname}`,
      etag: uploadedObject.etag,
      version: uploadedObject.versionId,
      size: stats.size,
      storage: 'minio',
    });
  }

  async _removeFile(req: Request, file: Express.Multer.File, cb: (error: Error | null) => void) {
    logger.info("ObjectStorageEngine._removeFile:  " + JSON.stringify(_.pick(file, ['originalname', 'encoding', 'mimetype', 'size', 'destination', 'filename', 'path'])));
    await this.service.removeObject(this.bucket, `${this.prefix}/${file.originalname}`);
    cb(null);
  }
}

module.exports = ObjectStorageEngine;
