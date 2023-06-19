const request = require('supertest');
const { setupApp } = require("../__utils__/expressUtils");

describe('Legacy Routes', () => {
  describe('GET /:date_published/articles/:id/getDocumentData', () => {
    it("should redirect to /articles/:id/edit", () => {
      const router = require('../../src/routes/legacy');
      const app = setupApp('/', router);

      return request(app)
        .get('/2022-09-01/articles/1/getDocumentData')
        .expect(302)
        .expect("Location", "/articles/1/edit");
    });
  });

  describe('GET /documents/:id.json', () => {
    it("should redirect to /articles/:id", () => {
      const router = require('../../src/routes/legacy');
      const app = setupApp('/', router);

      return request(app)
        .get('/documents/1.json')
        .expect(302)
        .expect("Location", "/articles/1");
    });
  });

  describe('GET /:id/preview.json', () => {
    it("should redirect to /articles/:id", () => {
      const router = require('../../src/routes/legacy');
      const app = setupApp('/', router);

      return request(app)
        .get('/1/preview.json')
        .expect(302)
        .expect("Location", "/articles/1");
    });
  });

  describe('GET /user_data', () => {
    it("should redirect to /users", () => {
      const router = require('../../src/routes/legacy');
      const app = setupApp('/', router);

      return request(app)
        .get('/user_data')
        .expect(302)
        .expect("Location", "/users/");
    });
  });

  describe('GET /:doc_num', () => {
    it("should redirect to /articles/:id", () => {
      const router = require('../../src/routes/legacy');
      const app = setupApp('/', router);

      return request(app)
        .get('/1')
        .expect(302)
        .expect("Location", "/articles/1");
    });
  });

  describe('GET /:date_published/getWireByDate', () => {
    it("should redirect to /articles/date/:date_published", () => {
      const router = require('../../src/routes/legacy');
      const app = setupApp('/', router);

      return request(app)
        .get('/2022-09-01/getWireByDate')
        .expect(302)
        .expect("Location", "/articles/date/2022-09-01");
    });
  });

  describe('PUT /:date_published/articles/:id/visitorCount', () => {
    it("should return success = true", () => {
      const router = require('../../src/routes/legacy');
      const app = setupApp('/', router);

      return request(app)
        .put('/2022-09-01/articles/1/visitorCount')
        .expect(200, { success: true});
    });
  });

  describe('GET /:doc_num/metrics/basic_metrics.json', () => {
    it("should return basic metrics", () => {
      const router = require('../../src/routes/legacy');
      const app = setupApp('/', router);

      return request(app)
        .get('/1/metrics/basic_metrics.json')
        .expect(200, { metrics: { readership: {}, uniqueReadership: {}}});
    });
  });
});
