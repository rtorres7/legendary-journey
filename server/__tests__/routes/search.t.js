const request = require("supertest");
const { setupAppWithUser } = require("../__utils__/expressUtils");

jest.mock("../../src/services/product-search-service.js", () => {
  return jest.fn().mockImplementation(() => {
    const { articles } = require("../__utils__/dataLoader");
    const filteredArticles = articles
      .filter((article) => article.htmlBody.includes("flu"))
      .map((article) => {
        const product = article.indexable;
        product.highlighted_result = [
          "(U) Both COVID-19 and <em>flu</em> vaccines have been shown to reduce illness, hospitalizations, and deaths.",
        ];
        product.id = product.id.toString();
        return product;
      });
    const allArticles = articles.map((article) => {
      const product = article.indexable;
      product.id = product.id.toString();
      return product;
    });
    return {
      search: jest
        .fn()
        .mockResolvedValueOnce({
          searchId: "",
          results: filteredArticles,
          aggregations: [],
          pages: 1,
          totalCount: 2,
          siteEnhancement: "",
          deClassifError: "",
        })
        .mockResolvedValueOnce({
          searchId: "",
          results: allArticles,
          aggregations: [],
          pages: 1,
          totalCount: 5,
          siteEnhancement: "",
          deClassifError: "",
        }),
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

describe("Search Routes", () => {
  describe("GET /search", () => {
    it("should return a search results with highlighting when text provided", () => {
      const router = require("../../src/routes/search");
      const app = setupAppWithUser(router, { id: 1 });

      return request(app)
        .get("/search?text=flu")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.results.length).toBe(2);
          expect(res.body.results[0].highlighted_result).toContain(
            "(U) Both COVID-19 and <em>flu</em> vaccines have been shown to reduce illness, hospitalizations, and deaths.",
          );
        });
    });

    it("should return a search results without highlighting when text not provided", () => {
      const router = require("../../src/routes/search");
      const app = setupAppWithUser(router, { id: 1 });

      return request(app)
        .get("/search")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.results.length).toBe(5);
          expect(res.body.results[0].highlighted_result).toBeUndefined();
        });
    });
  });
});
