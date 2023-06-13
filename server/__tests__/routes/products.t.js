const { GenericContainer, ElasticsearchContainer } = require("testcontainers");
const mongoose = require("mongoose");

const request = require("supertest");
const express = require("express");

const Product = require("../../src/models/products");
const {
  loadProductsIntoMongo,
  loadMetadata,
  loadElasticSearch,
} = require("../__utils__/dataLoader");
const { Client } = require("@elastic/elasticsearch");
const constant = require("../../src/util/constant");

describe("Product Routes", () => {
  let mongoContainer;
  let esContainer;
  let app;
  let esClient;

  beforeAll(async () => {
    mongoContainer = await new GenericContainer("mongo")
      .withExposedPorts(27017)
      .start();

    const mongoUrl = `mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(
      27017
    )}/mxms`;

    // Load products
    await loadProductsIntoMongo(mongoUrl);

    // Load metadata
    await loadMetadata(mongoUrl);

    esContainer = await new ElasticsearchContainer().start();
    esClient = new Client({ node: esContainer.getHttpUrl() });

    // Setup index
    await esClient.indices.create({
      index: "products",
      mappings: constant.indices[0].mappings,
    });

    // Load data
    await loadElasticSearch(esContainer.getHttpUrl());

    app = express();
    app.use(express.json());

    process.env.ES_URL = esContainer.getHttpUrl();
    const router = require("../../src/routes/products");
    app.use("/products", router);
  }, 70_000);

  beforeEach(async () => {
    await mongoose.connect(
      `mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(
        27017
      )}/mxms`,
      {
        useNewUrlParser: true,
      }
    );
  });

  afterAll(async () => {
    mongoContainer.stop();
    esContainer.stop();
  });

  afterEach(async () => {
    mongoose.connection.close();
  });

  describe("GET /products/date/:date", () => {
    it("should return all products for the given date", () => {
      return request(app)
        .get("/products/date/2022-09-01")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.features.length).toBe(1);
          expect(res.body.features[0].productNumber).toBe("WIReWIRe_sample_2");
        });
    });
  });

  describe("GET /products/:id", () => {
    it("should return an product for the given productNumber", () => {
      return request(app)
        .get("/products/WIReWIRe_sample_1")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.productNumber).toBe("WIReWIRe_sample_1");
        });
    });
  });

  describe("POST /products/processDocument", () => {
    it("should send redirect to POST /products when document_action is create", () => {
      return request(app)
        .post("/products/processDocument")
        .send({ document_action: "create" })
        .expect(307)
        .expect("Location", "/products/");
    });

    it("should send update document when document_action is save", async () => {
      const original = await Product.findOne({
        productNumber: "WIReWIRe_sample_1",
      });
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
          expect(res.body.product.classification).toBe("S");
          expect(res.body.date).toEqual(original.datePublished.toISOString());
          expect(res.body.doc_num).toBe(original.productNumber);
          expect(res.body.id).toBe(original.id);
          expect(res.body.state).toBe(original.state);

          const updated = await Product.findOne({
            productNumber: "WIReWIRe_sample_1",
          });
          expect(updated.classificationXml).toBe("S");

          expect(
            (await esClient.get({ index: "products", id: original.id }))._source
              .classificationXml
          ).toEqual("S");
        });
    });

    it("should send a 404 if any other action is given", () => {
      return request(app)
        .post("/products/processDocument")
        .send({ document_action: "other" })
        .expect(404);
    });
  });

  describe("POST /products", () => {
    it("should create the given product", () => {
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

          const updated = await Product.findById(res.body.product.id);
          expect(updated).toBeDefined();

          expect(
            await esClient.exists({
              index: "products",
              id: res.body.product.id,
            })
          ).toEqual(true);
        });
    });
  });

  describe("GET /products/:id/edit", () => {
    it("should return the requested product for editing", async () => {
      const productToBeFound = await Product.findById(
        "64709619aa530082dd5cc416"
      );
      return request(app)
        .get("/products/64709619aa530082dd5cc416/edit")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(productToBeFound.id);
        });
    });
  });

  describe("GET /products/:id/view", () => {
    it("should return the requested product for viewing", async () => {
      const productToBeFound = await Product.findById(
        "64709619aa530082dd5cc416"
      );
      return request(app)
        .get("/products/64709619aa530082dd5cc416/view")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(productToBeFound.id);
        });
    });
  });

  describe("PUT /products/:id", () => {
    it("should update document", async () => {
      const original = await Product.findOne({
        productNumber: "WIReWIRe_sample_1",
      });
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
          expect(res.body.product.classification).toBe("S");
          expect(res.body.date).toEqual(original.datePublished.toISOString());
          expect(res.body.doc_num).toBe(original.productNumber);
          expect(res.body.id).toBe(original.id);
          expect(res.body.state).toBe(original.state);

          const updated = await Product.findOne({
            productNumber: "WIReWIRe_sample_1",
          });
          expect(updated.classificationXml).toBe("S");

          expect(
            (await esClient.get({ index: "products", id: original.id }))._source
              .classificationXml
          ).toEqual("S");
        });
    });
  });

  describe("DELETE /products/:id", () => {
    it("should delete the product from the db", () => {
      return request(app)
        .delete("/products/64709619aa530082dd5cc416")
        .expect(200, { success: true })
        .then(async () => {
          const result = await Product.findById("64709619aa530082dd5cc416");
          expect(result).toBeNull();
        });
    });
  });
});
