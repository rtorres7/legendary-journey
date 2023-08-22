const request = require("supertest");
const { setupApp } = require("../__utils__/expressUtils");

describe("Legacy Routes", () => {
  describe("GET /wires/:date_published/articles/:id/getDocumentData", () => {
    it("should redirect to /articles/:id/edit", () => {
      const router = require("../../src/routes/legacy");
      const app = setupApp(router);

      return request(app)
        .get("/wires/2022-09-01/articles/1/getDocumentData")
        .expect(302)
        .expect("Location", "/articles/1/edit");
    });
  });

  describe("GET /preload/documents/:id.json", () => {
    it("should redirect to /articles/:id", () => {
      const router = require("../../src/routes/legacy");
      const app = setupApp(router);

      return request(app)
        .get("/preload/documents/1.json")
        .expect(302)
        .expect("Location", "/articles/1/preload");
    });
  });

  describe("GET /documents/:id/preview.json", () => {
    it("should redirect to /articles/:id", () => {
      const router = require("../../src/routes/legacy");
      const app = setupApp(router);

      return request(app)
        .get("/documents/1/preview.json")
        .expect(302)
        .expect("Location", "/articles/1");
    });
  });

  describe("GET /my_wire/user_data", () => {
    it("should redirect to /users", () => {
      const router = require("../../src/routes/legacy");
      const app = setupApp(router);

      return request(app)
        .get("/my_wire/user_data")
        .expect(302)
        .expect("Location", "/auth/profile");
    });
  });

  describe("GET /doucments/:doc_num", () => {
    it("should redirect to /articles/:id", () => {
      const router = require("../../src/routes/legacy");
      const app = setupApp(router);

      return request(app)
        .get("/documents/1")
        .expect(302)
        .expect("Location", "/articles/1");
    });
  });

  describe("GET /wires/:date_published/getWireByDate", () => {
    it("should redirect to /articles/date/:date_published", () => {
      const router = require("../../src/routes/legacy");
      const app = setupApp(router);

      return request(app)
        .get("/wires/2022-09-01/getWireByDate")
        .expect(302)
        .expect("Location", "/articles/date/2022-09-01");
    });
  });

  describe("PUT /wires/:date_published/articles/:id/visitorCount", () => {
    it("should return success = true", () => {
      const router = require("../../src/routes/legacy");
      const app = setupApp(router);

      return request(app)
        .put("/wires/2022-09-01/articles/1/visitorCount")
        .expect(200, { success: true });
    });
  });

  describe("GET /documents/:doc_num/metrics/basic_metrics.json", () => {
    it("should return basic metrics", () => {
      const router = require("../../src/routes/legacy");
      const app = setupApp(router);

      return request(app)
        .get("/documents/1/metrics/basic_metrics.json")
        .expect(302)
        .expect(
          "Location",
          "/metrics/products/1/unique-readership-by-organization",
        );
    });
  });

  describe("DELETE /documents/:id/deleteMe", () => {
    it("should redirect to /articles/:id/", () => {
      const router = require("../../src/routes/legacy");
      const app = setupApp(router);

      return request(app)
        .delete("/documents/1/deleteMe")
        .expect(307)
        .expect("Location", "/articles/1");
    });
  });
});
