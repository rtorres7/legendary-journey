const { GenericContainer, ElasticsearchContainer } = require("testcontainers");
const mongoose = require("mongoose");

const request = require("supertest");
const express = require("express");

const { Client } = require("@elastic/elasticsearch");
const constant = require("../../src/util/constant");
const {
  loadElasticSearch,
  loadProductsIntoMongo,
} = require("../__utils__/dataLoader");

describe("Home Routes", () => {
  let mongoContainer;
  let esContainer;
  let app;

  beforeAll(async () => {
    mongoContainer = await new GenericContainer("mongo")
      .withExposedPorts(27017)
      .start();

    // Load products
    await loadProductsIntoMongo(
      `mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(
        27017
      )}/products`
    );

    esContainer = await new ElasticsearchContainer().start();
    const client = new Client({ node: esContainer.getHttpUrl() });

    // Setup index
    await client.indices.create({
      index: "products",
      mappings: constant.indices[0].mappings,
    });

    // Load data
    await loadElasticSearch(esContainer.getHttpUrl());

    app = express();
    app.use(express.json());

    process.env.ES_URL = esContainer.getHttpUrl();
    const router = require("../../src/routes/home");
    app.use("/home", router);
  }, 70_000);

  beforeEach(async () => {
    await mongoose.connect(
      `mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(
        27017
      )}/products`,
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

  describe("GET /features", () => {
    it("should return featured products and briefs", () => {
      return request(app)
        .get("/home/features")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.featured.length).toBe(5);
          expect(res.body.briefs.length).toBe(3);
        });
    });
  });
});
