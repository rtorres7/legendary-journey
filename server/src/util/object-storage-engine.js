const ObjectStoreService = require('../services/object-store-service');

class ObjectStorageEngine {

  constructor(opts) {
    this.service = new ObjectStoreService();
    this.bucket = opts.bucket;
    this.prefix = opts.prefix;
  }

  async _handleFile(req, file, cb) {
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
      storage: 'minio'
    });
  }

  async _removeFile(req, file, cb) {
    await this.service.removeObject(this.bucket, `${this.prefix}/${file.originalname}`);
    cb(null, {});
  }
}

module.exports = ObjectStorageEngine;
