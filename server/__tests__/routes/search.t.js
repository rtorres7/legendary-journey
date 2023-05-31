const { GenericContainer, ElasticsearchContainer } = require('testcontainers');
const mongoose = require("mongoose");

const request = require('supertest');
const express = require("express");

const { Client } = require("@elastic/elasticsearch");
const constant = require("../../src/util/constant");
const { loadElasticSearch, loadMetadata } = require("../__utils__/dataLoader");

describe('Search Routes', () => {
  let mongoContainer;
  let esContainer;
  let app;

  beforeAll(async () => {
    mongoContainer = await new GenericContainer('mongo')
      .withExposedPorts(27017)
      .start();

    // Load metadata
    await loadMetadata(`mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(27017)}/metadata`);

    esContainer = await new ElasticsearchContainer().start();
    const client = new Client({ node: esContainer.getHttpUrl() });

    // Setup index
    await client.indices.create({
      index: 'products',
      mappings: constant.indices[0].mappings,
    });

    // Load data
    await loadElasticSearch(esContainer.getHttpUrl());

    app = express();
    app.use(express.json());

    process.env.ES_URL=esContainer.getHttpUrl();
    const router = require('../../src/routes/search');
    app.use('/search', router);
  }, 70_000);

  beforeEach(async () => {
    await mongoose.connect(`mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(27017)}/metadata`, {
      useNewUrlParser: true,
    });
  })

  afterAll(async () => {
    mongoContainer.stop();
    esContainer.stop();
  });

  afterEach(async () => {
    mongoose.connection.close();
  })

  describe('GET /search', () => {
    it("should return a search results with highlighting when text provided", () => {
      return request(app)
        .get('/search?text=flu')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.results.length).toBe(2);
          expect(res.body.results[0].highlighted_result).toContain("(U) Both COVID-19 and <em>flu</em> vaccines have been shown to reduce illness, hospitalizations, and deaths.");
        });
    });

    it("should return a search results without highlighting when text not provided", () => {
      return request(app)
        .get('/search')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.results.length).toBe(5);
          expect(res.body.results[0].highlighted_result).toBeUndefined();
        });
    });
  });
});
