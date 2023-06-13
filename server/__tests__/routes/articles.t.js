const { GenericContainer, ElasticsearchContainer } = require("testcontainers");
const mongoose = require("mongoose");

const request = require("supertest");
const express = require("express");

const Article = require("../../src/models/articles");
const {
  loadArticlesIntoMongo,
  loadMetadata,
  loadElasticSearch,
} = require("../__utils__/dataLoader");
const { Client } = require("@elastic/elasticsearch");

describe("Article Routes", () => {
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

    // Load articles
    await loadArticlesIntoMongo(mongoUrl);

    // Load metadata
    await loadMetadata(mongoUrl);

    esContainer = await new ElasticsearchContainer().start();
    esClient = new Client({ node: esContainer.getHttpUrl() });
    process.env.ES_URL=esContainer.getHttpUrl();

    // Setup index
    const constant = require("../../src/util/constant");
    await esClient.indices.create({
      index: "products",
      mappings: constant.indices[0].mappings,
    });

    // Load data
    await loadElasticSearch(esContainer.getHttpUrl());

    app = express();
    app.use(express.json());

    const router = require('../../src/routes/articles');
    app.use('/articles', router);
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

  describe("GET /articles/date/:date", () => {
    it("should return all articles for the given date", () => {
      return request(app)
        .get("/articles/date/2022-09-01")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.features.length).toBe(1);
          expect(res.body.features[0].productNumber).toBe("WIReWIRe_sample_2");
        });
    });
  });

  describe("GET /articles/:id", () => {
    it("should return an article for the given productNumber", () => {
      return request(app)
        .get("/articles/WIReWIRe_sample_1")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.productNumber).toBe("WIReWIRe_sample_1");
        });
    });
  });

  describe("POST /articles/processDocument", () => {
    it("should send redirect to POST /articles when document_action is create", () => {
      return request(app)
        .post("/articles/processDocument")
        .send({ document_action: "create" })
        .expect(307)
        .expect("Location", "/articles/");
    });

    it("should send update document when document_action is save", async () => {
      const original = await Article.findOne({
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
        producing_offices: {
          displayName: "Producing Offices",
          values: ["ANCESTRY", "OTHER"],
        },
        coauthors: { displayName: "Coauthors", values: ["ANCESTRY"] },
        coordinators: { displayName: "Coordinators", values: ["ANCESTRY"] },
        dissem_orgs: { displayName: "Audience", values: ["ANCESTRY"] },
        product_type_id: 10378,
      };

      return request(app)
        .post("/articles/processDocument")
        .send(postData)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.article.classification).toBe("S");
          expect(res.body.date).toEqual(original.datePublished.toISOString());
          expect(res.body.doc_num).toBe(original.productNumber);
          expect(res.body.id).toBe(original.id);
          expect(res.body.state).toBe(original.state);

          const updated = await Article.findOne({
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
        .post("/articles/processDocument")
        .send({ document_action: "other" })
        .expect(404);
    });
  });

  describe("POST /articles", () => {
    it("should create the given article", () => {
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

          const updated = await Article.findById(res.body.article.id);
          expect(updated).toBeDefined();

          expect(
            await esClient.exists({
              index: "products",
              id: res.body.article.id,
            })
          ).toEqual(true);
        });
    });
  });

  describe("GET /articles/:id/edit", () => {
    it("should return the requested article for editing", async () => {
      const articleToBeFound = await Article.findById(
        "64709619aa530082dd5cc416"
      );
      return request(app)
        .get("/articles/64709619aa530082dd5cc416/edit")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(articleToBeFound.id);
        });
    });
  });

  describe("GET /articles/:id/view", () => {
    it("should return the requested article for viewing", async () => {
      const articleToBeFound = await Article.findById(
        "64709619aa530082dd5cc416"
      );
      return request(app)
        .get("/articles/64709619aa530082dd5cc416/view")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(articleToBeFound.id);
        });
    });
  });

  describe("PUT /articles/:id", () => {
    it("should update document", async () => {
      const original = await Article.findOne({
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
        .put(`/articles/${original.id}`)
        .send(postData)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.article.classification).toBe("S");
          expect(res.body.date).toEqual(original.datePublished.toISOString());
          expect(res.body.doc_num).toBe(original.productNumber);
          expect(res.body.id).toBe(original.id);
          expect(res.body.state).toBe(original.state);

          const updated = await Article.findOne({
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

  describe("DELETE /articles/:id", () => {
    it("should delete the article from the db", () => {
      return request(app)
        .delete("/articles/64709619aa530082dd5cc416")
        .expect(200, { success: true })
        .then(async () => {
          const result = await Article.findById("64709619aa530082dd5cc416");
          expect(result).toBeNull();
        });
    });
  });
});
