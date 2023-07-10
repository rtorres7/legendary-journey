const os = require("os");
const fs = require("fs");
const config = require("../../src/config/config.js");
const { GenericContainer, Wait } = require("testcontainers");
const { Client } = require("minio");
// import { expect, jest, test } from "@jest/globals";
const constant = require("../../src/util/constant");
const logger = require("../../src/config/logger.js");
const ObjectStoreService = require("../../src/services/object-store-service");

describe("ObjectStoreService", () => {
  let minio;
  // let minioClient;
  let service;

  beforeAll(async () => {
    // https://node.testcontainers.org/configuration/
    // export DEBUG=testcontainers
    // export DEBUG=testcontainers:containers
    // process.env['DEBUG'] = 'testcontainers*';
    // process.env['DEBUG'] = 'testcontainers:containers';

    minio = await createMinioContainer();
    service = new ObjectStoreService();
    await initMinioData();
  });

  /** create minio container */
  async function createMinioContainer() {
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
          // Wait.forLogMessage(/SetCallHomeStatus/)
        ]),
      )
      .withTmpFs({ "/data": "rw,noexec,nosuid" })
      .withCommand(["server", "/data"]) // , '--console-address', ':9001'])
      .start();
  }

  /** initialize test buckets and objects */
  async function initMinioData() {
    if (!(await service.bucketExists("test-bucket"))) {
      logger.info("creating bucket");
      await service.makeBucket("test-bucket");
    } else {
      logger.info("bucket exists");
    }
    const buckets = await service.listBuckets();
    logger.info("buckets", buckets);
  }

  describe("environment", () => {
    it("should print all environment variables", () => {
      Object.keys(process.env).forEach((i) => {
        // logger.info(`${i} = ${process.env[i]}`);
      });
    });
  });

  describe("buckets", () => {
    it("should list default buckets", async () => {
      const result = await service.listBuckets();
      logger.info("list buckets", result);
      expect(result.find((i) => i.name === "test-bucket")).toBeTruthy();
    });
  });
});
