import { expect, jest } from "@jest/globals";

import { Client } from "minio";
import request from "supertest";
import { StartedTestContainer } from "testcontainers";
import { v4 as uuidv4 } from "uuid";

import config from "../../src/config/config";
import logger from "../../src/config/logger";
import { MinioContainerUtils } from "../__utils__/containerUtils";
import { articles, metadata } from "../__utils__/dataLoader";
import { setupAppWithUser } from "../__utils__/expressUtils";
import { AttachmentService } from "../../src/services/attachment-service";
import { FileUploadedObjectInfo } from "../../src/services/object-store-service";

jest.mock("../../src/services/product-service.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      findAllByDate: jest.fn().mockImplementation(() => {
        logger.info("ProductServiceMock.findAllByDate:");
        return Promise.resolve([articles[1]]);
      }),
      findByProductNumber: jest.fn().mockImplementation(() => {
        logger.info("ProductServiceMock.findByProductNumber:");
        return Promise.resolve(articles[0]);
      }),
      updateProduct: jest.fn().mockImplementation(() => {
        logger.info("ProductServiceMock.updateProduct:");
        return Promise.resolve(articles[0]);
      }),
      createProduct: jest.fn().mockImplementation(() => {
        logger.info("ProductServiceMock.createProduct:");
        return Promise.resolve(articles[0]);
      }),
      findById: jest.fn().mockImplementation(() => {
        logger.info("ProductServiceMock.findById:");
        return Promise.resolve(articles[0]);
      }),
      deleteProduct: jest.fn().mockImplementation(() => {
        logger.info("ProductServiceMock.deleteProduct:");
        return Promise.resolve(true);
      }),
      addAttachment: jest.fn().mockImplementation((productNumber, file: any) => {
        logger.info("ProductServiceMock.addAttachment:");
        const id = uuidv4();
        return Promise.resolve({
          _id: id,
          attachmentId: id,
          fileName: file.originalname,
          mimeType: file.mimetype,
          fileSize: file.size,
          createdAt: new Date(),
          type: "ATTACHMENT",
          destination: `${file.storage}://${file.bucket}/${file.objectName}`,
          visible: file.visible,
        });
      }),
      deleteAttachment: jest.fn().mockImplementation((productNumber, attachmentId) => {
        logger.info("ProductServiceMock.deleteAttachment:");
        return Promise.resolve();
      }),
    };
  });
});

// jest.mock("../../src/services/product-search-service.js", () => {
//   return jest.fn().mockImplementation(() => {
//     return {
//       create: jest.fn().mockImplementation(async () => {
//         return Promise.resolve();
//       }),
//       createIndexesIfNecessary: jest.fn().mockImplementation(async () => {
//         return Promise.resolve();
//       }),
//       delete: jest.fn().mockImplementation(async () => {
//         return Promise.resolve();
//       }),
//       indexAttachment: jest.fn().mockImplementation(async () => {
//         return Promise.resolve();
//       }),
//       removeIndexedAttachment: jest.fn().mockImplementation(async () => {
//         return Promise.resolve();
//       }),
//       update: jest.fn().mockImplementation(async () => {
//         return Promise.resolve();
//       }),
//     };
//   });
// });

jest.mock("../../src/services/metadata.js", () => {
  return jest.fn().mockImplementation(() => {
    // prettier-ignore
    return {
      findCountriesFor:           jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.countries.values),
      findSubRegionsForCountries: jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.subregions.values),
      findRegionsForSubRegions:   jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.regions.values),
      findTopicsFor:              jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.topics.values),
      findIssuesForTopics:        jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.issues.values),
      findProducingOfficesFor:    jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.producing_offices.values),
      findCoauthorsFor:           jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.coauthors.values),
      findCoordinatorsFor:        jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.coordinators.values),
      findDissemOrgsFor:          jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.dissem_orgs.values),
      findProductType:            jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.product_types.values[0]),
      findReportingTypeFor:       jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.reporting_types.values[0]),
      findNonStateActorsFor:      jest.fn<() => Promise<any>>().mockResolvedValue(metadata.criteria.non_state_actors.values),
    };
  });
});

const USER = { id: 1, firstName: "First", lastName: "Last", dn: "O=org,OU=orgunit,CN=commonname" };

describe("Article Attachment Routes", () => {
  let server: StartedTestContainer;
  let client: Client;

  beforeAll(async () => {
    server = await MinioContainerUtils.startContainer();
    client = MinioContainerUtils.newClient();
  });

  describe("Attachments", () => {
    afterEach(() => {
      jest.clearAllMocks();
      delete process.env.THROW_TEST_ERROR;
    });

    describe("POST /articles/:productNumber/attachments", () => {
      it("should put an attachment in the object store", async () => {
        const router = require("../../src/routes/articles");
        const app = setupAppWithUser(router, USER);

        const original = articles[0];
        const postData = {
          document_action: "save",
          classification: "S",
          id: original.id,
          date_published: original.datePublished,
          doc_num: original.productNumber,
          countries: ["AFG"],
          topics: ["TERR"],
          producing_offices: ["ANCESTRY", "OTHER"],
          coauthors: ["ANCESTRY"],
          coordinators: ["ANCESTRY"],
          dissem_orgs: ["ANCESTRY"],
          product_type_id: 10378,
        };

        // create product
        await request(app)
          .post("/articles/processDocument")
          .send(postData)
          .expect(200)
          .expect("Content-Type", /json/)
          .then(async (res) => {
            expect(res.body.success).toBe(true);
            // expect(res.body.date).toEqual(original.datePublished.toISOString());
            expect(res.body.doc_num).toBe(original.productNumber);
            expect(res.body.id).toBe(original.id);
            expect(res.body.state).toBe(original.state);
          });

        const file = await MinioContainerUtils.fileWriteRandomToTmp();

        // create attachment
        await request(app)
          .post(`/articles/${original.id}/attachments`)
          .field("Content-Type", "multipart/form-data")
          .set({ connection: "keep-alive" })
          .attach("file", file)
          .expect(200)
          .expect("Content-Type", "application/json; charset=utf-8")
          .then(async (res) => {
            logger.info("%j", res.body);
            expect(res.body.success).toBe(true);
            expect(res.body.att_id).toBeDefined();
            expect(res.body.url).toBe(`${config.basePath}/documents/${original.id}/attachments/${res.body.att_id}`);
            logger.info("res.body:j", res.body);
          });

        /*
      // can't run this since product service is mocked and does not return saved attachments
      // get attachment
      await request(app)
        .get(`/articles/${original.id}/attachments/${attachmentId}`)
        .expect(200)
        .expect('Content-Type', /binary/)
        .then(async (res) => {
          expect(res.body.success).toBe(true);
        });
      */
      });
    });
  });
});

describe("Article Attachment Service", () => {
  let server: StartedTestContainer;
  let client: Client;

  const attachmentService = new AttachmentService();

  beforeAll(async () => {
    server = await MinioContainerUtils.startContainer();
    client = MinioContainerUtils.newClient();
  });

  describe("add", async () => {
    const product = articles[0];
    const uploadInfo: FileUploadedObjectInfo = {
      fieldname: "file",
      originalname: "article.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      etag: "180b9159a3d82185c1b16a7049757420",
      versionId: null,
      storage: "minio",
      bucketName: "attachments",
      objectName: "f0907ac1-5aa9-4aa5-8691-adaf7c41fdf2/article.jpg-3ca31620f4d1",
      size: 58251,
      visible: true,
      attachmentId: "8abcefbe-d7bb-4c14-a385-3ca31620f4d1",
    };
    await attachmentService.add(product, uploadInfo);

    expect(product.attachmentsMetadata).toBeArrayOfSize(2);
  });
});

/*
fileUploadedObjectInfo:{"fieldname":"file","originalname":"article.jpg","encoding":"7bit","mimetype":"image/jpeg","etag":"180b9159a3d82185c1b16a7049757420","versionId":null,"storage":"minio","bucketName":"attachments","objectName":"f0907ac1-5aa9-4aa5-8691-adaf7c41fdf2/article.jpg-3ca31620f4d1","size":58251,"visible":true,"attachmentId":"8abcefbe-d7bb-4c14-a385-3ca31620f4d1"}
2023-08-11 10:44:31 info: AttachmentService.add:  uploadInfo:{"fieldname":"file","originalname":"article.jpg","encoding":"7bit","mimetype":"image/jpeg","etag":"180b9159a3d82185c1b16a7049757420","versionId":null,"storage":"minio","bucketName":"attachments","objectName":"f0907ac1-5aa9-4aa5-8691-adaf7c41fdf2/article.jpg-3ca31620f4d1","size":58251,"visible":true,"attachmentId":"8abcefbe-d7bb-4c14-a385-3ca31620f4d1"}
*/
