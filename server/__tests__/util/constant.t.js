const INDEXED_FIELDS = ['classification', 'countries', 'datePublished', 'htmlBody', 'issues', 'producingOffices', 'productType', 'regions', 'reportingType', 'subregions', 'topics'];
const STORED_FIELDS = ['classificationXml', 'needed', 'orgRestricted', 'productNumber', 'summary', 'summaryClassification', 'title', 'titleClassification', 'worldwide'];

describe('Constants', () => {
  describe('esNode', () => {
    it('should return elastic search url', () => {
      const { esNode } = require('../../src/util/constant');
      expect(esNode).toBe('http://elasticsearch:9200');
    });
  });

  describe('indicies', () => {
    it('should return index information for elastic search', () => {
      const { indices } = require('../../src/util/constant');
      expect(indices[0].index).toBe('products');


    });
  });
});
