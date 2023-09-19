import crypto from "crypto";
import fs from "fs";
import { Client } from "minio";
import tmp from "tmp";

import config from "../../src/config/config";
import logger from "../../src/config/logger";
import { KiwiPreconditions } from "@kiwiproject/kiwi-js";
import { ElasticSearchExtension } from "@kiwiproject/kiwi-test-js";
import elasticsearch from "@elastic/elasticsearch";

tmp.setGracefulCleanup();

export class MinioContainerUtils {
  static setMinioPort(port: number) {
    config.minio.port = port;
  }

  /**
   * @return {String} random bucket name
   */
  static randomName(): string {
    return "test-" + crypto.randomBytes(4).toString("hex").toLowerCase();
  }

  /**
   *
   */
  static async putFile(
    client: Client,
    bucketName: string,
    objectName: string,
    file: string,
  ): Promise<string> {
    KiwiPreconditions.checkArgument(fs.existsSync(file));
    const readStream = fs.createReadStream(file, "binary");
    return new Promise((resolve, reject) => {
      client
        .putObject(bucketName, objectName, readStream, {
          "content-type": "binary/octet-stream",
        })
        .then((uploadedObjectInfo) => {
          logger.info(
            `putRandomObject:  ${JSON.stringify(uploadedObjectInfo)}`,
          );
          resolve(objectName);
        })
        .catch((error) => reject(error));
    });
  }

  /**
   * Create tmp object in bucket
   * @return {Promise<string>} file/object name
   */
  static async putRandomObject(
    client: Client,
    bucketName: string,
    objectName?: string,
    objectSize?: number,
  ): Promise<string> {
    objectSize = objectSize === undefined ? 1048576 : objectSize;
    const file = await MinioContainerUtils.fileWriteRandomToTmp(objectSize);
    objectName = objectName ? objectName : file.split("/").pop();
    return this.putFile(client, bucketName, objectName, file);
  }

  /**
   * Write a tmp file containing random data.
   * @param {Number} size size in bytes
   * @return {Promise<String>} file path
   */
  static async fileWriteRandomToTmp(size?: number): Promise<string> {
    return new Promise((resolve) => {
      size = size === undefined ? 1048576 : size;
      const tmpObj = tmp.fileSync({ mode: 0o600, prefix: "obj" });
      const writer = fs.createWriteStream(tmpObj.name);
      // https://stackoverflow.com/questions/57506770
      // https://nodejs.org/api/stream.html#stream_event_drain
      let i = size;
      write();
      function write() {
        let ok = true;
        do {
          const chunkSize = i > 4096 ? 4096 : i;
          const chunk = crypto.randomBytes(chunkSize);
          i -= chunkSize;
          if (i === 0) {
            // Last time!
            writer.end(chunk, "binary", () => {
              logger.info(`fileWriteRandomToTmp:  ${tmpObj.name}`);
              resolve(tmpObj.name);
            });
          } else {
            // See if we should continue, or wait.
            // Don't pass the callback, because we're not done yet.
            ok = writer.write(chunk, "binary");
          }
        } while (i > 0 && ok);
        if (i > 0) {
          // Had to stop early!
          // Write some more once it drains.
          writer.once("drain", write);
        }
      }
    });
  }

  /**
   * Write stream to tmp file.
   */
  static async fileWriteStreamToTmp(
    reader: NodeJS.ReadableStream,
  ): Promise<string> {
    return new Promise((resolve) => {
      let size = 0;
      const tmpObj = tmp.fileSync({ mode: 0o600, prefix: "obj" });
      const writer = fs.createWriteStream(tmpObj.name);
      reader.on("data", (chunk) => {
        size += chunk.length;
      });
      reader.on("end", () => {
        logger.info(`fileWriteStreamToTmp:  wrote ${size} to ${tmpObj.name}`);
        resolve(tmpObj.name);
      });
      reader.pipe(writer);
    });
  }
}

export class ElasticSearchUtils {
  static setUrl(url: string) {
    config.elasticsearch.url = url;
    process.env.ES_URL = url;
  }

  /**
   * createIndex and deleteIndex must be called in pairs!
   */
  static async createIndex(client: elasticsearch.Client, name: string, mapping: any, pipelines: any[]): Promise<void> {
    if (!await client.indices.exists({ index: name })) {
      try {
        await ElasticSearchExtension.createIndex(name, mapping, pipelines);
      } catch (error) {
        if (error.message.includes("resource_already_exists_exception")) {
          const randomDelay = Math.floor(Math.random() * 2000) + 2000;
          await new Promise((resolve) => { setTimeout(resolve, randomDelay); });  
        } else {
          throw error;
        }
      }
    }
  }
}

export default {
  MinioContainerUtils,
  ElasticSearchUtils
};
