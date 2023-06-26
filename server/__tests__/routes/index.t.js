const request = require('supertest');
const { setupApp } = require('../__utils__/expressUtils');

jest.mock('../../src/services/metadata.js', () => {
  return jest.fn().mockImplementation(() => {
    const { metadata } = require("../__utils__/dataLoader");
    return {
      getAllMetadata: jest.fn().mockImplementation(() => {
        if (process.env.THROW_TEST_ERROR) {
          throw new Error('whoops');
        }

        return metadata;
      }),
    };
  });
});

describe('Index Routes', () => {
  afterEach(() => {
    delete process.env.THROW_TEST_ERROR;
  });

  describe('GET /metadata', () => {
    it("should return the metadata", () => {
      const router = require('../../src/routes/index');
      const app = setupApp('/', router);

      return request(app)
        .get('/metadata')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.metadata.criteria).toBeDefined();
        });
    });

    it('should return error response when lookup fails', () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require('../../src/routes/index');
      const app = setupApp('/', router);

      return request(app)
        .get('/metadata')
        .expect(200, {
          error: 'Unable to find metadata'
        });
    });
  })
})
