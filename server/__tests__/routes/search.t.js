const request = require('supertest');
const { setupApp } = require("../__utils__/expressUtils");

jest.mock('../../src/services/product-search-service.js', () => {
  return jest.fn().mockImplementation(() => {
    const { products } = require("../__utils__/dataLoader");
    const filteredProducts = products.filter(product => product.htmlBody.includes('flu'))
      .map(product => {
        const product = product.indexable;
        product.highlighted_result = ["(U) Both COVID-19 and <em>flu</em> vaccines have been shown to reduce illness, hospitalizations, and deaths."]
        return product;
      });
    const allProducts = products.map(product => product.indexable);
    return {
      search: jest.fn()
        .mockResolvedValueOnce({ searchId: '', results: filteredProducts, aggregations: [], pages: 1, totalCount: 2, siteEnhancement: '', deClassifError: '' })
        .mockResolvedValueOnce({ searchId: '', results: allProducts, aggregations: [], pages: 1, totalCount: 5, siteEnhancement: '', deClassifError: '' })
    };
  });
});

describe('Search Routes', () => {
  describe('GET /search', () => {
    it("should return a search results with highlighting when text provided", () => {
      const router = require('../../src/routes/search');
      const app = setupApp(router);

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
      const router = require('../../src/routes/search');
      const app = setupApp(router);

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
