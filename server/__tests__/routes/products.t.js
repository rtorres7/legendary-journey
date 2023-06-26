const request = require("supertest");
const { setupApp } = require("../__utils__/expressUtils");
const { products } = require("../__utils__/dataLoader");

jest.mock("../../src/services/product-service.js", () => {
  return jest.fn().mockImplementation(() => {
    const { products } = require("../__utils__/dataLoader");
    return {
      findAllByDate: jest.fn().mockImplementation(() => {
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }

        return [products[1]];
      }),
      findByProductNumber: jest.fn().mockImplementation(() => {
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }

        return products[0];
      }),
      updateProduct: jest.fn().mockImplementation(() => {
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }

        return products[0];
      }),
      createProduct: jest.fn().mockImplementation(() => {
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }

        return products[0];
      }),
      findById: jest.fn().mockImplementation(() => {
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }

        return products[0];
      }),
      deleteProduct: jest.fn().mockImplementation(() => {
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
        .mockResolvedValueOnce(metadata.criteria.countries.values),
      findSubRegionsForCountries: jest
        .fn()
        .mockResolvedValue(metadata.criteria.subregions.values),
      findRegionsForSubRegions: jest
        .fn()
        .mockResolvedValueOnce(metadata.criteria.regions.values),
      findTopicsFor: jest
        .fn()
        .mockResolvedValueOnce(metadata.criteria.topics.values),
      findIssuesForTopics: jest
        .fn()
        .mockResolvedValueOnce(metadata.criteria.issues.values),
      findProducingOfficesFor: jest
        .fn()
        .mockResolvedValueOnce(metadata.criteria.producing_offices.values),
      findCoauthorsFor: jest
        .fn()
        .mockResolvedValueOnce(metadata.criteria.coauthors.values),
      findCoordinatorsFor: jest
        .fn()
        .mockResolvedValueOnce(metadata.criteria.coordinators.values),
      findDissemOrgsFor: jest
        .fn()
        .mockResolvedValueOnce(metadata.criteria.dissem_orgs.values),
      findProductType: jest
        .fn()
        .mockResolvedValueOnce(metadata.criteria.product_types.values[0]),
      findReportingTypeFor: jest
        .fn()
        .mockResolvedValueOnce(metadata.criteria.reporting_types.values[0]),
      findNonStateActorsFor: jest
        .fn()
        .mockResolvedValueOnce(metadata.criteria.non_state_actors.values),
    };
  });
});

describe("Product Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.THROW_TEST_ERROR;
  });

  describe("GET /products/date/:date", () => {
    it("should return all products for the given date", () => {
      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      return request(app)
        .get("/products/date/2022-09-01")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.features.length).toBe(1);
          expect(res.body.features[0].productNumber).toBe("WIReWIRe_sample_2");
        });
    });

    it("should return error response when lookup fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      return request(app).get("/products/date/2022-09-01").expect(200, {
        error: "Unable to find products for date 2022-09-01: whoops",
      });
    });
  });

  describe("GET /products/:id", () => {
    it("should return an product for the given productNumber", () => {
      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      return request(app)
        .get("/products/WIReWIRe_sample_1")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.productNumber).toBe("WIReWIRe_sample_1");
        });
    });

    it("should return error response when lookup fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      return request(app).get("/products/WIReWIRe_sample_1").expect(200, {
        error:
          "Unable to find product with product number WIReWIRe_sample_1: whoops",
      });
    });
  });

  describe("POST /products/processDocument", () => {
    it("should send redirect to POST /products when document_action is create", () => {
      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      return request(app)
        .post("/products/processDocument")
        .send({ document_action: "create" })
        .expect(307)
        .expect("Location", "/products/");
    });

    it("should send update document when document_action is save", async () => {
      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      const original = products[0];
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
        .post("/products/processDocument")
        .send(postData)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.date).toEqual(original.datePublished.toISOString());
          expect(res.body.doc_num).toBe(original.productNumber);
          expect(res.body.id).toBe(original.id);
          expect(res.body.state).toBe(original.state);
        });
    });

    it("should send a 404 if any other action is given", () => {
      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      return request(app)
        .post("/products/processDocument")
        .send({ document_action: "other" })
        .expect(404);
    });
  });

  describe("POST /products", () => {
    it("should create the given product", () => {
      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      const postData = {
        document_action: "save",
        classification: "S",
        date_published: new Date(),
      };

      return request(app)
        .post("/products")
        .send(postData)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          expect(res.body.product).toBeDefined();
          expect(res.body.product.id).toBeDefined();
          expect(res.body.doc_num).toBeDefined();
        });
    });

    it("should create the given product including producing_office", () => {
      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      const postData = {
        document_action: "save",
        classification: "S",
        date_published: new Date(),
        producing_office: "ANCESTRY",
      };

      return request(app)
        .post("/products")
        .send(postData)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          expect(res.body.product).toBeDefined();
          expect(res.body.product.id).toBeDefined();
          expect(res.body.doc_num).toBeDefined();
        });
    });

    it("should create the given product defaulting date published", () => {
      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      const postData = {
        document_action: "save",
        classification: "S",
      };

      return request(app)
        .post("/products")
        .send(postData)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          expect(res.body.product).toBeDefined();
          expect(res.body.product.id).toBeDefined();
          expect(res.body.doc_num).toBeDefined();
        });
    });

    it("should return error response when create fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      const postData = {
        document_action: "save",
        classification: "S",
        date_published: new Date(),
      };

      return request(app).post("/products").send(postData).expect(200, {
        error: "There was a problem creating product: whoops",
      });
    });
  });

  describe("GET /products/:id/edit", () => {
    it("should return the requested product for editing", async () => {
      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      return request(app)
        .get("/products/64709619aa530082dd5cc416/edit")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(products[0].id);
        });
    });

    it("should return error response when lookup fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      return request(app)
        .get("/products/64709619aa530082dd5cc416/edit")
        .expect(200, {
          error:
            "Unable to find product with id 64709619aa530082dd5cc416: whoops",
        });
    });
  });

  describe("GET /products/:id/view", () => {
    it("should return the requested product for viewing", async () => {
      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      return request(app)
        .get("/products/64709619aa530082dd5cc416/view")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(products[0].id);
        });
    });

    it("should return error response when lookup fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      return request(app)
        .get("/products/64709619aa530082dd5cc416/view")
        .expect(200, {
          error:
            "Unable to find product with id 64709619aa530082dd5cc416: whoops",
        });
    });
  });

  describe("PUT /products/:id", () => {
    it("should update document", async () => {
      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      const original = products[0];

      const postData = {
        document_action: "save",
        classification: "S",
        id: original.id,
        date_published: original.datePublished,
        doc_num: original.productNumber,
      };

      return request(app)
        .put(`/products/${original.id}`)
        .send(postData)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.date).toEqual(original.datePublished.toISOString());
          expect(res.body.doc_num).toBe(original.productNumber);
          expect(res.body.id).toBe(original.id);
          expect(res.body.state).toBe(original.state);
        });
    });

    it("should return error response when update fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      const original = products[0];

      const postData = {
        document_action: "save",
        classification: "S",
        id: original.id,
        date_published: original.datePublished,
        doc_num: original.productNumber,
      };

      return request(app)
        .put(`/products/${original.id}`)
        .send(postData)
        .expect(200, {
          error: "There was a problem updating product: whoops",
        });
    });
  });

  describe("DELETE /products/:id", () => {
    it("should delete the product from the db", () => {
      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      return request(app)
        .delete("/products/64709619aa530082dd5cc416")
        .expect(200, { success: true });
    });

    it("should return error response when delete fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/products");
      const app = setupApp("/products", router);

      return request(app)
        .delete("/products/64709619aa530082dd5cc416")
        .expect(200, {
          error: "Unable to delete product",
        });
    });
  });
});
