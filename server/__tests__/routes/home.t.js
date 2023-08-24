const request = require('supertest');
const { setupAppWithUser} = require("../__utils__/expressUtils");

jest.mock('../../src/services/product-service.js', () => {
  return jest.fn().mockImplementation(() => {
    const { articles } = require("../__utils__/dataLoader");
    return {
      findFeaturesAndBriefs: jest.fn().mockImplementation(() => {
        if (process.env.THROW_TEST_ERROR) {
          throw new Error('whoops');
        }

        return {
          featured: articles.map(article => article.features),
          briefs: articles.slice(0, 3).map(article => article.features),
        };
      })
    };
  });
});

jest.mock("../../src/services/workspace.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
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

describe('Home Routes', () => {
  afterEach(() => {
    delete process.env.THROW_TEST_ERROR;
  });

  describe('GET /features', () => {
    it("should return featured articles and briefs", async () => {
      const router = require('../../src/routes/home');
      const app = setupAppWithUser(router, {id: 1});

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
      const app = setupAppWithUser(router, {id: 1});

      return request(app)
        .get('/home/features')
        .expect(200, {
          error: 'Unable to find features and briefs'
        });
    });
  });
});
