import fs from "fs";
import "jest-extended";
import { Client } from "minio";
import { StartedTestContainer } from "testcontainers";

import logger from "../../src/config/logger";
import { ObjectStoreService } from "../../src/services/object-store-service";
import { MinioContainerUtils } from "../__utils__/containerUtils";

// https://jest-extended.jestcommunity.dev/docs/matchers
describe("ObjectStoreService", () => {

  let minioServer: StartedTestContainer;
  let minioClient: Client;

  let service: ObjectStoreService;

  beforeAll(async () => {
    // https://node.testcontainers.org/configuration/
    // export DEBUG=testcontainers
    // export DEBUG=testcontainers:containers
    // process.env['DEBUG'] = 'testcontainers*';
    // process.env['DEBUG'] = 'testcontainers:containers';

    minioServer = await MinioContainerUtils.startContainer();
    service = new ObjectStoreService();
    minioClient = service.getClient();
    await initMinioData();
  });

  afterAll(async () => {
    minioServer.stop();
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
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.bucketExists(bucketName)).resolves.toBeFalse();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.bucketExists(bucketName)).resolves.toBeTrue();
      });
      it("should error creating existing bucket", async () => {
        const bucketName = MinioContainerUtils.randomName();
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
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.listBuckets()).resolves.toSatisfyAny((i) => i.name === bucketName);
      });
    });

    describe("removeBucket", () => {
      it("should remove bucket", async () => {
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.bucketExists(bucketName)).resolves.toBeFalse();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.bucketExists(bucketName)).resolves.toBeTrue();
        await expect(service.removeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.bucketExists(bucketName)).resolves.toBeFalse();
      });
      it("should error removing nonexistent bucket", async () => {
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.bucketExists(bucketName)).resolves.toBeFalse();
        await expect(service.removeBucket(bucketName)).rejects.toMatchObject({ code: "NoSuchBucket" });
      });
    });
  });

  describe("objects", () => {
    describe("putObject", () => {
      it("should put object in bucket", async () => {
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        const objectName = await MinioContainerUtils.putRandomObject(minioClient, bucketName);
        await expect(service.listObjects(bucketName)).resolves.toSatisfyAny((i) => i.name === objectName);
      });
      it("should put empty object in bucket", async () => {
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        const objectName = await MinioContainerUtils.putRandomObject(minioClient, bucketName, null, 0);
        await expect(service.listObjects(bucketName)).resolves.toSatisfyAny((i) => i.name === objectName);
        await expect(service.statObject(bucketName, objectName)).resolves.toMatchObject({ size: 0 });
      });
      it("should error trying to put object in nonexistent bucket", async () => {
        const bucketName = MinioContainerUtils.randomName();
        await expect(MinioContainerUtils.putRandomObject(minioClient, bucketName)).rejects.toMatchObject({ code: "NoSuchBucket" });
      });
      it("should replace existing object", async () => {
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        const objectName = await MinioContainerUtils.putRandomObject(minioClient, bucketName);
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(1);
        await expect(MinioContainerUtils.putRandomObject(minioClient, bucketName, objectName, 0)).resolves.toEqual(objectName);
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(1);
        await expect(service.statObject(bucketName, objectName)).resolves.toMatchObject({ size: 0 });
        await expect(service.removeObject(bucketName, objectName)).resolves.toBeUndefined();
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(0);
      });
    });

    describe("statObject", () => {
      it("should stat object", async () => {
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        const objectName = await MinioContainerUtils.putRandomObject(minioClient, bucketName);
        await expect(service.statObject(bucketName, objectName)).resolves.toMatchObject({ metaData: { "content-type": "binary/octet-stream" }, versionId: null });
      });
      it("should error trying to stat nonexistent object", async () => {
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.statObject(bucketName, MinioContainerUtils.randomName())).rejects.toThrow("Not Found");
      });
    });

    describe("getObject", () => {
      it("should get object", async () => {
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        const objectName = await MinioContainerUtils.putRandomObject(minioClient, bucketName);
        const objectStat = await service.statObject(bucketName, objectName);
        const stream = await service.getObject(bucketName, objectName);
        const file = await MinioContainerUtils.fileWriteStreamToTmp(stream);
        const fileStat = fs.statSync(file);
        expect(objectStat.size).toEqual(fileStat.size);
      });
      it("should error trying to get nonexistent object", async () => {
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.statObject(bucketName, MinioContainerUtils.randomName())).rejects.toThrow("Not Found");
      });
    });

    describe("listObjects", () => {
      it("should list bucket contents", async () => {
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(0);
        await MinioContainerUtils.putRandomObject(minioClient, bucketName);
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(1);
        await MinioContainerUtils.putRandomObject(minioClient, bucketName);
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(2);
      });
      it("should error trying to list nonexistent bucket", async () => {
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.listObjects(bucketName)).rejects.toMatchObject({ code: "NoSuchBucket" });
      });
    });

    describe("removeObject", () => {
      it("should remove object", async () => {
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        const objectName = await MinioContainerUtils.putRandomObject(minioClient, bucketName);
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(1);
        await expect(service.removeObject(bucketName, objectName)).resolves.toBeUndefined();
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(0);
      });
      it("should error trying to remove from nonexistent bucket", async () => {
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.removeObject(bucketName, bucketName)).rejects.toMatchObject({ code: "NoSuchBucket" });
      });
      it("should remove nonexistent object", async () => {
        const bucketName = MinioContainerUtils.randomName();
        await expect(service.makeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.removeObject(bucketName, MinioContainerUtils.randomName())).resolves.toBeUndefined();
      });
    });
  });

  /** Initialize test buckets and objects */
  async function initMinioData(): Promise<void> {
    if (!(await service.bucketExists("attachments"))) {
      await service.makeBucket("attachments");
    } else {
      logger.info(`initMinioData:  bucket attachments already exists`);
    }
    const buckets = await service.listBuckets();
    logger.info(`initMinioData:  buckets ${buckets.map((i) => i.name)}`);
  }
});
