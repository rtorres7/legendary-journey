const crypto = require("crypto");
const fs = require("fs");
const tmp = require("tmp");
const { GenericContainer, StartedTestContainer, Wait } = require("testcontainers");
const { BucketItemFromList, Client } = require("minio");
const config = require("../../src/config/config.js");
const logger = require("../../src/config/logger.js");

const ObjectStoreService = require("../../src/services/object-store-service");
// https://jest-extended.jestcommunity.dev/docs/matchers
describe("ObjectStoreService", () => {
  /** @type {StartedTestContainer} */
  let minio;
  /** @type {Client} */
  let minioClient;
  /** @type {ObjectStoreService} */
  let service;
  /** @type {String} */
  let tmpSubDir;

  beforeAll(async () => {
    // https://node.testcontainers.org/configuration/
    // export DEBUG=testcontainers
    // export DEBUG=testcontainers:containers
    // process.env['DEBUG'] = 'testcontainers*';
    // process.env['DEBUG'] = 'testcontainers:containers';

    minio = await createMinioContainer();
    service = new ObjectStoreService();
    minioClient = service.getClient();
    await initMinioData();
    tmp.setGracefulCleanup();
    tmpSubDir = tmp.dirSync().name;
  });

  /*
  describe('environment', () => {
    it('should print all environment variables', () => {
      Object.keys(process.env).forEach((i) => logger.info(`${i} = ${process.env[i]}`));
    });
  });
  */

  describe("buckets", () => {
    describe("makeBucket", () => {
      it("should create a new bucket", async () => {
        const bucketName = testName();
        await expect(service.bucketExists(bucketName)).resolves.toBeFalse();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.bucketExists(bucketName)).resolves.toBeTrue();
      });
      it("should error creating existing bucket", async () => {
        const bucketName = testName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.bucketExists(bucketName)).resolves.toBeTrue();
        await expect(service.makeBucket(bucketName)).rejects.toMatchObject({ code: "BucketAlreadyOwnedByYou" });
      });
      it("should error creating bucket with invalid name", async () => {
        const bucketName = "invalid_NAME";
        await expect(service.makeBucket(bucketName)).rejects.toThrow("Invalid bucket name");
      });
    });

    describe("listBuckets", () => {
      it("should list bucket", async () => {
        const bucketName = testName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.listBuckets()).resolves.toSatisfyAny((i) => i.name === bucketName);
      });
    });

    describe("removeBucket", () => {
      it("should remove bucket", async () => {
        const bucketName = testName();
        await expect(service.bucketExists(bucketName)).resolves.toBeFalse();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.bucketExists(bucketName)).resolves.toBeTrue();
        await expect(service.removeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.bucketExists(bucketName)).resolves.toBeFalse();
      });
      it("should error removing nonexistent bucket", async () => {
        const bucketName = testName();
        await expect(service.bucketExists(bucketName)).resolves.toBeFalse();
        await expect(service.removeBucket(bucketName)).rejects.toMatchObject({ code: "NoSuchBucket" });
      });
    });
  });

  describe("objects", () => {
    describe("putObject", () => {
      it("should put object in bucket", async () => {
        const bucketName = testName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        const objectName = await testCreateObject(bucketName);
        await expect(service.listObjects(bucketName)).resolves.toSatisfyAny((i) => i.name === objectName);
      });
      it("should put empty object in bucket", async () => {
        const bucketName = testName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        const objectName = await testCreateObject(bucketName, null, 0);
        await expect(service.listObjects(bucketName)).resolves.toSatisfyAny((i) => i.name === objectName);
        await expect(service.statObject(bucketName, objectName)).resolves.toMatchObject({ size: 0 });
      });
      it("should error trying to put object in nonexistent bucket", async () => {
        const bucketName = testName();
        await expect(testCreateObject(bucketName)).rejects.toMatchObject({ code: "NoSuchBucket" });
      });
      it("should replace existing object", async () => {
        const bucketName = testName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        const objectName = await testCreateObject(bucketName);
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(1);
        await expect(testCreateObject(bucketName, objectName, 0)).resolves.toEqual(objectName);
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(1);
        await expect(service.statObject(bucketName, objectName)).resolves.toMatchObject({ size: 0 });
        await expect(service.removeObject(bucketName, objectName)).resolves.toBeUndefined();
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(0);
      });
    });

    describe("statObject", () => {
      it("should stat object", async () => {
        const bucketName = testName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        const objectName = await testCreateObject(bucketName);
        await expect(service.statObject(bucketName, objectName)).resolves.toMatchObject({ metaData: { "content-type": "binary/octet-stream" }, versionId: null });
      });
      it("should error trying to stat nonexistent object", async () => {
        const bucketName = testName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.statObject(bucketName, testName())).rejects.toThrow("Not Found");
      });
    });

    describe("getObject", () => {
      it("should get object", async () => {
        const bucketName = testName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        const objectName = await testCreateObject(bucketName);
        const objectStat = await service.statObject(bucketName, objectName);
        const stream = await service.getObject(bucketName, objectName);
        const file = await testWriteStreamToFile(stream);
        const fileStat = fs.statSync(file);
        expect(objectStat.size).toEqual(fileStat.size);
      });
      it("should error trying to get nonexistent object", async () => {
        const bucketName = testName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.statObject(bucketName, testName())).rejects.toThrow("Not Found");
      });
    });

    describe("listObjects", () => {
      it("should list bucket contents", async () => {
        const bucketName = testName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(0);
        await testCreateObject(bucketName);
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(1);
        await testCreateObject(bucketName);
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(2);
      });
      it("should error trying to list nonexistent bucket", async () => {
        const bucketName = testName();
        await expect(service.listObjects(bucketName)).rejects.toMatchObject({ code: "NoSuchBucket" });
      });
    });

    describe("removeObject", () => {
      it("should remove object", async () => {
        const bucketName = testName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        const objectName = await testCreateObject(bucketName);
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(1);
        await expect(service.removeObject(bucketName, objectName)).resolves.toBeUndefined();
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(0);
      });
      it("should error trying to remove from nonexistent bucket", async () => {
        const bucketName = testName();
        await expect(service.removeObject(bucketName, bucketName)).rejects.toMatchObject({ code: "NoSuchBucket" });
      });
      it("should remove nonexistent object", async () => {
        const bucketName = testName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.removeObject(bucketName, testName())).resolves.toBeUndefined();
      });
    });
  });

  /**
   * Create minio container
   * @return {Promise<StartedTestContainer>}
   */
  function createMinioContainer() {
    // prettier-ignore
    return new GenericContainer("quay.io/minio/minio:latest")
      .withEnvironment({
        MINIO_BROWSER: "off",
        MINIO_ROOT_USER: config.minio.accessKey,
        MINIO_ROOT_PASSWORD: config.minio.secretKey,
      })
      .withExposedPorts({ container: 9000, host: 9000 }) // , { container: 9001, host: 9001 })
      .withWaitStrategy(
        Wait.forAll([
          Wait.forListeningPorts(),
          Wait.forLogMessage(/1 Online/),
        ]),
      )
      .withTmpFs({ "/data": "rw,noexec,nosuid" })
      .withCommand(["server", "/data"]) // , "--console-address", ":9001"])
      .start();
  }

  /** Initialize test buckets and objects */
  async function initMinioData() {
    if (!(await service.bucketExists("attachments"))) {
      await service.makeBucket("attachments");
    } else {
      logger.info(`initMinioData:  bucket attachments already exists`);
    }
    const buckets = await service.listBuckets();
    logger.info(`initMinioData:  buckets ${buckets.map((i) => i.name)}`);
  }

  /**
   * @return {String} random bucket name
   */
  function testName() {
    return "test-" + crypto.randomBytes(4).toString("hex").toLowerCase();
  }

  /**
   * Create tmp object in bucket
   * @param {String} bucketName
   * @param {Number} objectName optional default random name
   * @param {Number} objectSize optional default 1048576
   * @return {Promise<String>} file/object name
   */
  async function testCreateObject(bucketName, objectName, objectSize) {
    objectSize = objectSize === undefined ? 1048576 : objectSize;
    const file = await testCreateFile(objectSize);
    objectName = !!objectName ? objectName : file.split("/").pop();
    const readStream = fs.createReadStream(file, "binary");
    return new Promise((resolve, reject) => {
      service
        .putObject(bucketName, objectName, readStream, { "content-type": "binary/octet-stream" })
        .then((uploadedObjectInfo) => {
          // logger.info(`testCreateObject:  ${JSON.stringify(uploadedObjectInfo)}`);
          resolve(objectName);
        })
        .catch((error) => reject(error));
    });
  }

  /**
   * Create tmp file containing random data
   * @param {Number} size size in bytes
   * @return {Promise<String>} file path
   */
  function testCreateFile(size) {
    return new Promise((resolve, reject) => {
      const tmpObj = tmp.fileSync({ dir: tmpSubDir, mode: 0o600, prefix: "obj" });
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
            writer.end(chunk, "binary", (err) => {
              if (err) reject(err);
              // logger.info(`testCreateFile:  ${tmpObj.name}`);
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
   * @param {ReadableStream} reader
   * @return {Promise<String>} file
   */
  function testWriteStreamToFile(reader) {
    return new Promise((resolve, reject) => {
      let size = 0;
      const tmpObj = tmp.fileSync({ dir: tmpSubDir, mode: 0o600, prefix: "obj" });
      const writer = fs.createWriteStream(tmpObj.name);
      reader.on("data", (chunk) => {
        size += chunk.length;
      });
      reader.on("end", () => {
        logger.info(`wrote ${size} to ${tmpObj.name}`);
        resolve(tmpObj.name);
      });
      reader.pipe(writer);
    });
  }
});
