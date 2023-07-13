const request = require('supertest');
const express = require("express");
const { setupApp } = require("../__utils__/expressUtils");

jest.mock('../../src/services/product-service.js', () => {
  return jest.fn().mockImplementation(() => {
    const { articles } = require("../__utils__/dataLoader");
    return {
      findFeaturesAndBriefs: jest.fn().mockImplementation(() => {
        if (process.env.THROW_TEST_ERROR) {
          throw new Error('whoops');
        }

        return {
          featured: articles,
          briefs: articles.slice(0, 3),
        }
      })
    };
  });
});

describe('Home Routes', () => {
  afterEach(() => {
    delete process.env.THROW_TEST_ERROR;
  });

  describe('GET /features', () => {
    it("should return featured articles and briefs", () => {
      const app = express();
      app.use(express.json());

      const router = require('../../src/routes/home');
      app.use(router);

      return request(app)
        .get('/home/features')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.featured.length).toBe(5);
          expect(res.body.briefs.length).toBe(3);
        });
    });

    it('should return error response when lookup fails', () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require('../../src/routes/home');
      const app = setupApp(router);

      return request(app)
        .get('/home/features')
        .expect(200, {
          error: 'Unable to find features and briefs'
        });
    });
  });
});
