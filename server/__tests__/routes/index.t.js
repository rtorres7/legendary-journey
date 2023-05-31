const { GenericContainer } = require('testcontainers');
const mongoose = require("mongoose");

const request = require('supertest');
const express = require("express");

const router = require('../../src/routes/index');
const { loadMetadata } = require("../__utils__/dataLoader");

const app = express();
app.use(express.json());
app.use('/', router);

describe('Index Routes', () => {
  let container;

  beforeAll(async () => {
    container = await new GenericContainer('mongo')
      .withExposedPorts(27017)
      .start();

    // Load metadata
    await loadMetadata(`mongodb://${container.getHost()}:${container.getMappedPort(27017)}/metadata`);
  }, 70_000);

  beforeEach(async () => {
    await mongoose.connect(`mongodb://${container.getHost()}:${container.getMappedPort(27017)}/metadata`, {
      useNewUrlParser: true,
    });
  })

  afterAll(async () => {
    container.stop();
  });

  afterEach(async () => {
    mongoose.connection.close();
  })

  describe('GET /metadata', () => {
    it("should return the metadata", () => {
      return request(app)
        .get('/metadata')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.metadata.criteria).toBeDefined();
        });
    });
  })
})
