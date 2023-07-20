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

    console.log("Params", req.params);
    console.log("File: ", file)
    console.log("Name: ", file.originalname);
    const uploadedObject = await this.service.putObject(this.bucket, `${this.prefix}/${file.originalname}`, file.stream);

    console.log('Saved: ', uploadedObject);
    cb(null, {
      bucket: this.bucket,
      path: `${this.prefix}/${file.originalname}`,
      etag: uploadedObject.etag,
      version: uploadedObject.versionId
    });
  }

  async _removeFile(req, file, cb) {
    cb();
  }
}

module.exports = ObjectStorageEngine;
