import path from "path";

import _ from "lodash";
import { KiwiPreconditions } from "@kiwiproject/kiwi-js";

// import { config } from "../config/config";
import { logger } from "../config/logger";
import { ObjectStoreService, FileUploadedObjectInfo } from "./object-store-service";

/** placeholder {@link Article.AttacmentSchema} */
interface Attachment {
  /** mongodb generated */
  id?: string;
  /** uuid generated on upload */
  attachmentId: string;
  fileName: string;
  mimeType: string;
  createdAt: Date;
  updatedAt?: Date;
  fileSize: number;
  type: string;
  destination: string;
  visible: boolean;
  deleted?: boolean;
}

/** placeholder {@link Article} */
interface Product extends Record<string, any> {
  attachments: Attachment[];
  markModified(arg0: string): unknown;
}

/**
 * Service class to handle Product.attachmentMetadata.
 * DOES NOT SAVE to the database, caller is responsible for saving the product.
 */
export class AttachmentService {
  private objectStoreService = new ObjectStoreService();

  /**
   * Add object to store.
   * @param product
   * @param uploadInfo 
   * @returns attachment metadata WARNING does not have a mongo id until the product is saved
   */
  async add(product: any, uploadInfo: FileUploadedObjectInfo): Promise<Attachment> {
    KiwiPreconditions.checkArgumentDefined(product);
    KiwiPreconditions.checkArgument(Array.isArray(product.attachments));
    KiwiPreconditions.checkArgumentDefined(uploadInfo);
    KiwiPreconditions.checkArgumentNotBlank(uploadInfo.originalname);
    KiwiPreconditions.checkArgumentNotBlank(uploadInfo.mimetype);
    KiwiPreconditions.checkPositiveOrZero(uploadInfo.size);
    KiwiPreconditions.checkArgumentNotBlank(uploadInfo.storage);
    KiwiPreconditions.checkArgumentNotBlank(uploadInfo.bucketName);
    KiwiPreconditions.checkArgumentNotBlank(uploadInfo.objectName);

    logger.info("AttachmentService.add:  uploadInfo:%j", uploadInfo);

    // delete if already exists
    if (this.isThumbnail(uploadInfo.originalname)) {
      uploadInfo.visible = false;
      await this.delete(product, "article");
    }

    // add metadata to array
    const metadata: Attachment = {
      attachmentId: uploadInfo.attachmentId,
      fileName: uploadInfo.originalname,
      mimeType: uploadInfo.mimetype,
      fileSize: uploadInfo.size,
      createdAt: new Date(),
      type: "ATTACHMENT",
      destination: this.buildUrl(uploadInfo.storage, uploadInfo.bucketName, uploadInfo.objectName),
      visible: uploadInfo.visible,
    };
    product.attachments.push(metadata);
    product.markModified('attachments');

    logger.info("AttachmentService.add:  attachment:%j", metadata);
    return Promise.resolve(metadata);
  }

  /**
   * Retrieve object from store.
   * @param product 
   * @param id 
   * @returns metadata and object byte stream
   */
  async get(product: Product, id: string): Promise<{ metadata: Attachment, stream: NodeJS.ReadableStream }> {
    KiwiPreconditions.checkArgumentDefined(product);
    KiwiPreconditions.checkArgumentDefined(id);
    const metadata = this.findMetadata(product, id);
    logger.info("AttachmentService.get:  id:%s, metadata:%j", id, metadata);
    const { bucketName, objectName } = this.parseUrl(metadata.destination);
    const stream = await this.objectStoreService.getObject(bucketName, objectName);
    KiwiPreconditions.checkArgumentDefined(stream);
    return Promise.resolve({ metadata, stream });
  }

  /**
   * Delete object from store.
   */
  async delete(product: Product, id: string): Promise<Attachment[]> {
    const removed = _.remove(product.attachments, this.findAttachmentFn(id));
    if (removed.length === 0) {
      return Promise.resolve([]);
    }
    for (const i of removed) {
      i.deleted = true;
      const { bucketName, objectName } = this.parseUrl(i.destination);
      await this.objectStoreService.removeObject(bucketName, objectName);
    }
    product.markModified('attachments');
    return Promise.resolve(removed);
  }

  /**
   * Find attachment metadata in {@link Product.attachments}
   */
  findMetadata(product: Product, id: string): Attachment {
    // logger.info("%O", product);
    KiwiPreconditions.checkArgument(Array.isArray(product.attachments));
    const results = product.attachments.filter(this.findAttachmentFn(id));
    switch(results.length) {
      case 0:
        throw new Error(`attachment metadata ${id} not found`);
      case 1:
        return results[0];
      default:
        if (id === 'article') {
          // in case of multiple thumbnails, delete all except the last one
          logger.warn("AttachmentService.findMetadata:  id:%s, results.length:%d", id, results.length);
          for (let i = 0; i < results.length - 1; i++) {
            results[i].deleted = true;
          }
          return results[results.length - 1];
        }
        throw new Error(`too many attachment metadata ${id} count ${results.length}`);
    }
  }

  /**
   * Special case if id === "article", searches only against fileNames matching article.ext
   * @param id mongodb id (_id or id) or attachmentId or fileName
   * @returns 
   */
  private findAttachmentFn(id: string): (i: Attachment) => boolean {
    if (id === "article") {
      return (i: Attachment) => !i.deleted && /^article\.(jpg|jpeg|png|gif|webp)$/i.test(i.fileName);
    } else {
      return (i: Attachment) => !i.deleted && (i.id === id || i.attachmentId === id || i.fileName === id);
    }
  }  

  /** storage://bucket/objectName */
  private buildUrl(storage: string, bucketName: string, objectName: string): string {
    KiwiPreconditions.checkArgumentDefined(storage);
    KiwiPreconditions.checkArgumentDefined(bucketName);
    KiwiPreconditions.checkArgumentDefined(objectName);
    return `${storage}://${bucketName}/${objectName}`;
  }

  /** storage://bucket/objectName */
  public parseUrl(url: string): { storage: string; bucketName: string; objectName: string } {
    KiwiPreconditions.checkArgumentDefined(url);
    const [storage, path] = url.split("://");
    const bucketSeparatorIndex = path.indexOf("/");
    const bucketName = path.substring(0, bucketSeparatorIndex);
    const objectName = path.substring(bucketSeparatorIndex + 1);
    KiwiPreconditions.checkArgumentDefined(storage);
    KiwiPreconditions.checkArgument(storage === "minio");
    KiwiPreconditions.checkArgumentDefined(bucketName);
    KiwiPreconditions.checkArgumentDefined(objectName);
    const ret = { storage, bucketName, objectName };
    // logger.info("AttachmentService.parseUrl:  %j", ret);
    return ret;
  }

  /**
   * @returns true if filename matches 'article.ext' where ext is an image extension.
   */
  private isThumbnail(fileName: string): boolean {
    KiwiPreconditions.checkArgumentDefined(fileName);
    const parsed = path.parse(fileName);
    return parsed.name === "article" && /^\.(jpg|jpeg|png|gif|webp)$/i.test(parsed.ext);
  }
}

export default AttachmentService;
