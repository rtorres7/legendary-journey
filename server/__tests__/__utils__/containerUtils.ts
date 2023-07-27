import crypto from 'crypto';
import fs from 'fs';
import { Client } from 'minio';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import tmp from 'tmp';

import config from '../../src/config/config';
import logger from '../../src/config/logger';

tmp.setGracefulCleanup();
const tmpSubDir = tmp.dirSync().name;

export class MinioContainerUtils {
  /** */
  static async startContainer(): Promise<StartedTestContainer> {
    return await new GenericContainer('quay.io/minio/minio:latest')
      .withEnvironment({
        MINIO_BROWSER: 'off',
        MINIO_ROOT_USER: config.minio.accessKey,
        MINIO_ROOT_PASSWORD: config.minio.secretKey,
      })
      .withExposedPorts({ container: 9000, host: 9000 }) // , { container: 9001, host: 9001 })
      .withWaitStrategy(Wait.forAll([Wait.forListeningPorts(), Wait.forLogMessage(/1 Online/)]))
      .withTmpFs({ '/data': 'rw,noexec,nosuid' })
      .withCommand(['server', '/data']) // , "--console-address", ":9001"])
      .start();
  }

  /** */
  static newClient(): Client {
    return new Client({
      endPoint: config.minio.endPoint,
      port: config.minio.port,
      useSSL: config.minio.useSsl,
      accessKey: config.minio.accessKey,
      secretKey: config.minio.secretKey,
    });
  }

  /**
   * @return {String} random bucket name
   */
  static randomName(): string {
    return 'test-' + crypto.randomBytes(4).toString('hex').toLowerCase();
  }

  /**
   * Create tmp object in bucket
   * @return {Promise<string>} file/object name
   */
  static async putRandomObject(client: Client, bucketName: string, objectName?: string, objectSize?: number): Promise<string> {
    objectSize = objectSize === undefined ? 1048576 : objectSize;
    const file = await MinioContainerUtils.fileWriteRandomToTmp(objectSize);
    objectName = objectName ? objectName : file.split('/').pop();
    const readStream = fs.createReadStream(file, 'binary');
    return new Promise((resolve, reject) => {
      client
        .putObject(bucketName, objectName, readStream, { 'content-type': 'binary/octet-stream' })
        .then((uploadedObjectInfo) => {
          logger.info(`putRandomObject:  ${JSON.stringify(uploadedObjectInfo)}`);
          resolve(objectName);
        })
        .catch((error) => reject(error));
    });
  }

  /**
   * Write a tmp file containing random data.
   * @param {Number} size size in bytes
   * @return {Promise<String>} file path
   */
  static async fileWriteRandomToTmp(size?: number): Promise<string> {
    return new Promise((resolve, reject) => {
      size = size === undefined ? 1048576 : size;
      const tmpObj = tmp.fileSync({ mode: 0o600, prefix: 'obj' });
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
            writer.end(chunk, 'binary', () => {
              logger.info(`fileWriteRandomToTmp:  ${tmpObj.name}`);
              resolve(tmpObj.name);
            });
          } else {
            // See if we should continue, or wait.
            // Don't pass the callback, because we're not done yet.
            ok = writer.write(chunk, 'binary');
          }
        } while (i > 0 && ok);
        if (i > 0) {
          // Had to stop early!
          // Write some more once it drains.
          writer.once('drain', write);
        }
      }
    });
  }

  /**
   * Write stream to tmp file.
   */
  static async fileWriteStreamToTmp(reader: NodeJS.ReadableStream): Promise<string> {
    return new Promise((resolve, reject) => {
      let size = 0;
      const tmpObj = tmp.fileSync({ mode: 0o600, prefix: 'obj' });
      const writer = fs.createWriteStream(tmpObj.name);
      reader.on('data', (chunk) => {
        size += chunk.length;
      });
      reader.on('end', () => {
        logger.info(`fileWriteStreamToTmp:  wrote ${size} to ${tmpObj.name}`);
        resolve(tmpObj.name);
      });
      reader.pipe(writer);
    });
  }
}

export default {
  MinioContainerUtils,
};
