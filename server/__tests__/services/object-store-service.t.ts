import fs from "fs";
import "jest-extended";
import { BucketItem, Client } from "minio";

import { ObjectStoreService } from "../../src/services/object-store-service";
import { MinioContainerUtils } from "../__utils__/containerUtils";
import { MinioExtension } from "@kiwiproject/kiwi-test-js";

describe("ObjectStoreService", () => {
  let client: Client;
  let service: ObjectStoreService;
  let bucketName: string;

  beforeAll(async () => {
    MinioContainerUtils.setMinioHost("127.0.0.1");
    MinioContainerUtils.setMinioPort(MinioExtension.getMinioPort());
    service = new ObjectStoreService();
    client = service.getClient();
  });

  beforeEach(async () => {
    bucketName = MinioContainerUtils.randomName();
    await client.makeBucket(bucketName);
  });

  afterEach(async () => {
    if (bucketName === undefined) {
      return;
    }

    const exists: boolean = await client.bucketExists(bucketName);

    if (exists) {
      const objects: Array<BucketItem> = await service.listObjects(bucketName);
      for (const obj of objects) {
        await service.removeObject(bucketName, `${obj.name}`);
      }
      await service.removeBucket(bucketName);
    }
  });

  describe("buckets", () => {
    describe("makeBucket", () => {
      it("should create a new bucket", async () => {
        const newBucketName: string = MinioContainerUtils.randomName();

        await expect(service.bucketExists(newBucketName)).resolves.toBeFalse();
        await expect(
          service.makeBucket(newBucketName),
        ).resolves.toBeUndefined();
        await expect(service.bucketExists(newBucketName)).resolves.toBeTrue();

        await client.removeBucket(newBucketName);
      });

      it("should error creating existing bucket", async () => {
        await expect(service.bucketExists(bucketName)).resolves.toBeTrue();
        await expect(service.makeBucket(bucketName)).rejects.toMatchObject({
          code: "BucketAlreadyOwnedByYou",
        });
      });

      it("should error creating bucket with invalid name", async () => {
        const invalidBucketName: string = "invalid_NAME";
        await expect(service.makeBucket(invalidBucketName)).rejects.toThrow(
          "Invalid bucket name",
        );
      });
    });

    describe("listBuckets", () => {
      it("should list bucket", async () => {
        await expect(service.listBuckets()).resolves.toSatisfyAny(
          (i) => i.name === bucketName,
        );
      });
    });

    describe("removeBucket", () => {
      it("should remove bucket", async () => {
        await expect(service.bucketExists(bucketName)).resolves.toBeTrue();
        await expect(service.removeBucket(bucketName)).resolves.toBeUndefined();
        await expect(service.bucketExists(bucketName)).resolves.toBeFalse();
      });

      it("should error removing nonexistent bucket", async () => {
        const nonExistentBucket = MinioContainerUtils.randomName();

        await expect(
          service.bucketExists(nonExistentBucket),
        ).resolves.toBeFalse();
        await expect(
          service.removeBucket(nonExistentBucket),
        ).rejects.toMatchObject({ code: "NoSuchBucket" });
      });
    });
  });

  describe("objects", () => {
    describe("putObject", () => {
      it("should put object in bucket", async () => {
        const objectName = await MinioContainerUtils.putRandomObject(
          client,
          bucketName,
        );
        await expect(service.listObjects(bucketName)).resolves.toSatisfyAny(
          (i) => i.name === objectName,
        );
      });

      it("should put empty object in bucket", async () => {
        const objectName = await MinioContainerUtils.putRandomObject(
          client,
          bucketName,
          null,
          0,
        );
        await expect(service.listObjects(bucketName)).resolves.toSatisfyAny(
          (i) => i.name === objectName,
        );
        await expect(
          service.statObject(bucketName, objectName),
        ).resolves.toMatchObject({ size: 0 });
      });

      it("should error trying to put object in nonexistent bucket", async () => {
        const nonExistentBucket = MinioContainerUtils.randomName();
        await expect(
          MinioContainerUtils.putRandomObject(client, nonExistentBucket),
        ).rejects.toMatchObject({ code: "NoSuchBucket" });
      });

      it("should replace existing object", async () => {
        const objectName = await MinioContainerUtils.putRandomObject(
          client,
          bucketName,
        );
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(
          1,
        );
        await expect(
          MinioContainerUtils.putRandomObject(
            client,
            bucketName,
            objectName,
            0,
          ),
        ).resolves.toEqual(objectName);
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(
          1,
        );
        await expect(
          service.statObject(bucketName, objectName),
        ).resolves.toMatchObject({ size: 0 });
        await expect(
          service.removeObject(bucketName, objectName),
        ).resolves.toBeUndefined();
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(
          0,
        );
      });
    });

    describe("statObject", () => {
      it("should stat object", async () => {
        const objectName = await MinioContainerUtils.putRandomObject(
          client,
          bucketName,
        );
        await expect(
          service.statObject(bucketName, objectName),
        ).resolves.toMatchObject({
          metaData: { "content-type": "binary/octet-stream" },
          versionId: null,
        });
      });

      it("should error trying to stat nonexistent object", async () => {
        await expect(
          service.statObject(bucketName, MinioContainerUtils.randomName()),
        ).rejects.toThrow("Not Found");
      });
    });

    describe("getObject", () => {
      it("should get object", async () => {
        const objectName = await MinioContainerUtils.putRandomObject(
          client,
          bucketName,
        );
        const objectStat = await service.statObject(bucketName, objectName);
        const stream = await service.getObject(bucketName, objectName);
        const file = await MinioContainerUtils.fileWriteStreamToTmp(stream);
        const fileStat = fs.statSync(file);
        expect(objectStat.size).toEqual(fileStat.size);
      });

      it("should error trying to get nonexistent object", async () => {
        await expect(
          service.statObject(bucketName, MinioContainerUtils.randomName()),
        ).rejects.toThrow("Not Found");
      });
    });

    describe("listObjects", () => {
      it("should list bucket contents", async () => {
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(
          0,
        );

        await MinioContainerUtils.putRandomObject(client, bucketName);
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(
          1,
        );

        await MinioContainerUtils.putRandomObject(client, bucketName);
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(
          2,
        );
      });

      it("should error trying to list nonexistent bucket", async () => {
        const nonExistentBucket = MinioContainerUtils.randomName();
        await expect(
          service.listObjects(nonExistentBucket),
        ).rejects.toMatchObject({ code: "NoSuchBucket" });
      });
    });

    describe("removeObject", () => {
      it("should remove object", async () => {
        const objectName = await MinioContainerUtils.putRandomObject(
          client,
          bucketName,
        );
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(
          1,
        );

        await expect(
          service.removeObject(bucketName, objectName),
        ).resolves.toBeUndefined();
        await expect(service.listObjects(bucketName)).resolves.toBeArrayOfSize(
          0,
        );
      });

      it("should error trying to remove from nonexistent bucket", async () => {
        const nonExistentBucket = MinioContainerUtils.randomName();
        await expect(
          service.removeObject(nonExistentBucket, nonExistentBucket),
        ).rejects.toMatchObject({ code: "NoSuchBucket" });
      });

      it("should remove nonexistent object", async () => {
        await expect(
          service.removeObject(bucketName, MinioContainerUtils.randomName()),
        ).resolves.toBeUndefined();
      });
    });
  });
});
