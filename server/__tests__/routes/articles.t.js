import { expect, jest } from "@jest/globals";
import request from "supertest";
import dayjs from "dayjs";

import { articles } from "../__utils__/dataLoader";
import { setupApp, setupAppWithUser } from "../__utils__/expressUtils";

jest.mock("../../src/services/product-service.js", () => {
  return jest.fn().mockImplementation(() => {
    const { articles } = require("../__utils__/dataLoader");
    return {
      findAllByDate: jest.fn().mockImplementation(() => {
        // console.log("mock ProductService.findAllByDate:", process.env.THROW_TEST_ERROR);
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }
        return [articles[1]];
      }),
      findByProductNumber: jest.fn().mockImplementation((productNumber) => {
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }

        if (productNumber === "not-found") {
          return null;
        }

        return articles[0];
      }),
      updateProduct: jest.fn().mockImplementation(() => {
        // console.log("mock ProductService.updateProduct:", process.env.THROW_TEST_ERROR);
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }
        return articles[0];
      }),
      createProduct: jest.fn().mockImplementation(() => {
        // console.log("mock ProductService.createProduct:", process.env.THROW_TEST_ERROR);
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }
        return articles[0];
      }),
      findById: jest.fn().mockImplementation((id) => {
        // console.log("mock ProductService.findById:", process.env.THROW_TEST_ERROR);
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }

        if (id === "not-found") {
          return null;
        }

        return articles[0];
      }),
      deleteProduct: jest.fn().mockImplementation(() => {
        // console.log("mock ProductService.deleteProduct:", process.env.THROW_TEST_ERROR);
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }
      }),
    };
  });
});

jest.mock("../../src/services/metadata.js", () => {
  return jest.fn().mockImplementation(() => {
    const { metadata } = require("../__utils__/dataLoader");
    return {
      findCountriesFor: jest
        .fn()
        .mockResolvedValue(metadata.criteria.countries.values),
      findSubRegionsForCountries: jest
        .fn()
        .mockResolvedValue(metadata.criteria.subregions.values),
      findRegionsForSubRegions: jest
        .fn()
        .mockResolvedValue(metadata.criteria.regions.values),
      findTopicsFor: jest
        .fn()
        .mockResolvedValue(metadata.criteria.topics.values),
      findIssuesForTopics: jest
        .fn()
        .mockResolvedValue(metadata.criteria.issues.values),
      findProducingOfficesFor: jest
        .fn()
        .mockResolvedValue(metadata.criteria.producing_offices.values),
      findCoauthorsFor: jest
        .fn()
        .mockResolvedValue(metadata.criteria.coauthors.values),
      findCoordinatorsFor: jest
        .fn()
        .mockResolvedValue(metadata.criteria.coordinators.values),
      findDissemOrgsFor: jest
        .fn()
        .mockResolvedValue(metadata.criteria.dissem_orgs.values),
      findProductType: jest
        .fn()
        .mockResolvedValue(metadata.criteria.product_types.values[0]),
      findReportingTypeFor: jest
        .fn()
        .mockResolvedValue(metadata.criteria.reporting_types.values[0]),
      findNonStateActorsFor: jest
        .fn()
        .mockResolvedValue(metadata.criteria.non_state_actors.values),
    };
  });
});

jest.mock("../../src/services/workspace.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      deleteSavedProductForAllUsers: jest.fn().mockImplementation(() => {}),
      isProductSaved: jest
        .fn()
        .mockImplementationOnce(() => {
          return true;
        })
        .mockImplementation(() => {
          return false;
        }),
    };
  });
});

jest.mock("../../src/models/event_log", () => {
  return jest.fn().mockImplementation((data) => ({
    eventType: data.eventType || "PRODUCT_VIEW",
    timestamp: data.timestamp || Date.now(),
    userId: data.userId || 1,
    productId: data.productId || "WIReWIRe_sample_1",
    meta: data.meta || {},

    save: jest.fn().mockResolvedValue(this),
  }));
});

jest.mock("../../src/data/elasticsearch", () => {
  let mockDocumentStore = {};

  return {
    index: jest.fn((params) => {
      if (!params.index || !params.id || !params.document) {
        return Promise.reject(
          new Error("Missing required parameters for indexing."),
        );
      }

      mockDocumentStore[params.id] = params.document;
      return Promise.resolve({
        result: "created",
        _id: params.id,
        _index: params.index,
      });
    }),
    get: jest.fn((params) => {
      if (!params.index || !params.id) {
        return Promise.reject(
          new Error("Missing required parameters for getting a document."),
        );
      }

      const document = mockDocumentStore[params.id];
      if (!document) {
        return Promise.reject(new Error("Document not found."));
      }

      return Promise.resolve({
        _index: params.index,
        _id: params.id,
        _source: document,
      });
    }),
  };
});

jest.mock("../../src/services/event-service.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      registerEvent: jest
        .fn()
        .mockImplementation(async (eventType, userId, productId, meta = {}) => {
          const event = {
            eventType,
            userId,
            productId,
            meta,
            timestamp: Date.now(),
            save: jest.fn(),
          };

          await event.save();

          const user = {
            Organization: "ANCESTRY",
          };

          const enrichedData = {
            eventType,
            userId,
            productId,
            meta,
            timestamp: event.timestamp,
            organization: user.Organization,
          };

          await require("../../src/data/elasticsearch").index({
            index: "eventlogs",
            id: event.id,
            document: enrichedData,
          });

          return event;
        }),
    };
  });
});

const USER = {
  id: 1,
  firstName: "First",
  lastName: "Last",
  dn: "O=org,OU=orgunit,CN=commonname",
};

describe("Article Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.THROW_TEST_ERROR;
  });

  describe("GET /articles/date/:date", () => {
    it("should return all articles for the given date", () => {
      delete process.env.THROW_TEST_ERROR;

      const router = require("../../src/routes/articles");
      const app = setupAppWithUser(router, { id: 1 });

      return request(app)
        .get("/articles/date/2022-09-01")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.features.length).toBe(1);
          expect(res.body.features[0].productNumber).toBe("WIReWIRe_sample_2");
        });
    });

    it("should return error response when lookup fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/articles");
      const app = setupAppWithUser(router, { id: 1 });

      return request(app).get("/articles/date/2022-09-01").expect(500, {
        message: 'Unable to find articles for date 2022-09-01: whoops',
        error: 'Unable to find articles for date 2022-09-01: whoops',
        code: 500,
        fieldName: '',
        itemId: ''
      });
    });
  });

  describe("GET /articles/:productNumber", () => {
    it("should return an article for the given productNumber", () => {
      const router = require("../../src/routes/articles");
      const app = setupAppWithUser(router, { id: 1 });

      return request(app)
        .get("/articles/WIReWIRe_sample_1")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.productNumber).toBe("WIReWIRe_sample_1");
        });
    });

    it("should return a 404 when the productNumber can't be found", () => {
      const router = require("../../src/routes/articles");
      const app = setupAppWithUser(router, { id: 1 });

      return request(app)
        .get("/articles/not-found")
        .expect(404)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.message).toBe("Unable to find product with product number not-found");
        });
    });

    it("should return error response when lookup fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/articles");
      const app = setupAppWithUser(router, { id: 1 });

      return request(app).get("/articles/WIReWIRe_sample_1").expect(500, {
        message: 'Unable to find article with product number WIReWIRe_sample_1: whoops',
        error: 'Unable to find article with product number WIReWIRe_sample_1: whoops',
        code: 500,
        fieldName: '',
        itemId: ''
      });
    });
  });

  describe("POST /articles/processDocument", () => {
    it("should send redirect to POST /articles when document_action is create", () => {
      const router = require("../../src/routes/articles");
      const app = setupApp(router);

      return request(app)
        .post("/articles/processDocument")
        .send({ document_action: "create" })
        .expect(307)
        .expect("Location", "/articles/");
    });

    it("should send update document when document_action is save", async () => {
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

      return request(app)
        .post("/articles/processDocument")
        .send(postData)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.date).toEqual(
            dayjs(original.datePublished).format("YYYY-MM-DD"),
          );
          expect(res.body.doc_num).toBe(original.productNumber);
          expect(res.body.id).toBe(original.id);
          expect(res.body.state).toBe(original.state);
        });
    });

    it("should send a 404 if any other action is given", () => {
      const router = require("../../src/routes/articles");
      const app = setupApp(router);

      return request(app)
        .post("/articles/processDocument")
        .send({ document_action: "other" })
        .expect(404);
    });
  });

  describe("POST /articles", () => {
    it("should create the given article", () => {
      const router = require("../../src/routes/articles");
      const app = setupAppWithUser(router, USER);

      const postData = {
        document_action: "save",
        classification: "S",
        date_published: new Date(),
      };

      return request(app)
        .post("/articles")
        .send(postData)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          expect(res.body.article).toBeDefined();
          expect(res.body.article.id).toBeDefined();
          expect(res.body.doc_num).toBeDefined();
        });
    });

    it("should create the given article including producing_office", () => {
      const router = require("../../src/routes/articles");
      const app = setupAppWithUser(router, USER);

      const postData = {
        document_action: "save",
        classification: "S",
        date_published: new Date(),
        producing_office: "ANCESTRY",
      };

      return request(app)
        .post("/articles")
        .send(postData)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          expect(res.body.article).toBeDefined();
          expect(res.body.article.id).toBeDefined();
          expect(res.body.doc_num).toBeDefined();
        });
    });

    it("should create the given article defaulting date published", () => {
      const router = require("../../src/routes/articles");
      const app = setupAppWithUser(router, USER);

      const postData = {
        document_action: "save",
        classification: "S",
      };

      return request(app)
        .post("/articles")
        .send(postData)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          expect(res.body.article).toBeDefined();
          expect(res.body.article.id).toBeDefined();
          expect(res.body.doc_num).toBeDefined();
        });
    });

    it("should return error response when create fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/articles");
      const app = setupAppWithUser(router, USER);

      const postData = {
        document_action: "save",
        classification: "S",
        date_published: new Date(),
      };

      return request(app).post("/articles")
        .send(postData)
        .expect(500, {
          message: 'There was a problem creating product: whoops',
          error: 'There was a problem creating product: whoops',
          code: 500,
          fieldName: '',
          itemId: ''
        });
    });
  });

  describe("GET /articles/:id/edit", () => {
    it("should return the requested article for editing", async () => {
      const router = require("../../src/routes/articles");
      const app = setupApp(router);

      return request(app)
        .get("/articles/64709619aa530082dd5cc416/edit")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(articles[0].id);
        });
    });

    it("should return a 404 when the product id can't be found", async () => {
      const router = require("../../src/routes/articles");
      const app = setupAppWithUser(router, { id: 1 });

      return request(app)
        .get("/articles/not-found/edit")
        .expect(404)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.message).toBe("Unable to find product with id not-found");
        });
    });

    it("should return error response when lookup fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/articles");
      const app = setupApp(router);

      return request(app)
        .get("/articles/64709619aa530082dd5cc416/edit")
        .expect(500, {
          message: 'Unable to find article with id 64709619aa530082dd5cc416: whoops',
          error: 'Unable to find article with id 64709619aa530082dd5cc416: whoops',
          code: 500,
          fieldName: '',
          itemId: ''
        });
    });
  });

  describe("GET /articles/:id/view", () => {
    it("should return the requested article for viewing", async () => {
      const router = require("../../src/routes/articles");
      const app = setupAppWithUser(router, { id: 1 });

      return request(app)
        .get("/articles/64709619aa530082dd5cc416/view")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(articles[0].id);
        });
    });

    it("should return a 404 when the product id can't be found", async () => {
      const router = require("../../src/routes/articles");
      const app = setupAppWithUser(router, { id: 1 });

      return request(app)
        .get("/articles/not-found/view")
        .expect(404)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.message).toBe("Unable to find product with id not-found");
        });
    });

    it("should return error response when lookup fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/articles");
      const app = setupAppWithUser(router, { id: 1 });

      return request(app)
        .get("/articles/64709619aa530082dd5cc416/view")
        .expect(500, {
          message: 'Unable to find article with id 64709619aa530082dd5cc416: whoops',
          error: 'Unable to find article with id 64709619aa530082dd5cc416: whoops',
          code: 500,
          fieldName: '',
          itemId: ''
        });
    });
  });

  describe("PUT /articles/:id", () => {
    it("should update document", async () => {
      const router = require("../../src/routes/articles");
      const app = setupAppWithUser(router, USER);

      const original = articles[0];

      const postData = {
        document_action: "save",
        classification: "S",
        id: original.id,
        date_published: original.datePublished,
        doc_num: original.productNumber,
        coauthors: ["ANCESTRY"],
      };

      return request(app)
        .put(`/articles/${original.id}`)
        .send(postData)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res, rej) => {
          expect(rej).toBeUndefined();
          expect(res.body.success).toBe(true);
          expect(res.body.date).toEqual(
            dayjs(original.datePublished).format("YYYY-MM-DD"),
          );
          expect(res.body.doc_num).toBe(original.productNumber);
          expect(res.body.id).toBe(original.id);
          expect(res.body.state).toBe(original.state);
        });
    });

    it("should return error response when update fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/articles");
      const app = setupAppWithUser(router, USER);

      const original = articles[0];

      const postData = {
        document_action: "save",
        classification: "S",
        id: original.id,
        date_published: original.datePublished,
        doc_num: original.productNumber,
        coauthors: ["ANCESTRY"],
      };

      return request(app)
        .put(`/articles/${original.id}`)
        .send(postData)
        .expect(500, {
          message: 'There was a problem updating product: whoops',
          error: 'There was a problem updating product: whoops',
          code: 500,
          fieldName: '',
          itemId: ''
        });
    });
  });

  describe("DELETE /articles/:id", () => {
    it("should delete the article from the db", () => {
      const router = require("../../src/routes/articles");
      const app = setupApp(router);

      return request(app)
        .delete("/articles/64709619aa530082dd5cc416")
        .expect(200, { success: true });
    });

    it("should return error response when delete fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/articles");
      const app = setupApp(router);

      return request(app)
        .delete("/articles/64709619aa530082dd5cc416")
        .expect(500, {
          message: 'Unable to delete article: whoops',
          error: 'Unable to delete article: whoops',
          code: 500,
          fieldName: '',
          itemId: ''
        });
    });
  });
});
