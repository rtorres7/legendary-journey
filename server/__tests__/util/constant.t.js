const INDEXED_FIELDS = ['classification', 'countries', 'datePublished', 'htmlBody', 'issues', 'nonStateActors', 'producingOffices', 'productType', 'regions', 'reportingType', 'subregions', 'topics'];
const STORED_FIELDS = ['classificationXml', 'needed', 'orgRestricted', 'productNumber', 'summary', 'summaryClassification', 'title', 'titleClassification', 'worldwide'];

describe('Constants', () => {
  describe('indicies', () => {
    it('should return index information for elastic search', () => {
      const { indices } = require('../../src/util/constant');
      expect(indices[0].index).toBe('products');

      const allColumns = Object.keys(indices[0].mappings.properties);
      const productIndexedColumns = allColumns.map(key => {
        if (indices[0].mappings.properties[key].index) {
          return key;
        }

        return null;
      }).filter(name => name);

      expect(productIndexedColumns).toIncludeAllMembers(INDEXED_FIELDS);

      const productStoredColumns = allColumns.map(key => {
        if (!indices[0].mappings.properties[key].index) {
          return key;
        }

        return null;
      }).filter(name => name);

      expect(productStoredColumns).toIncludeAllMembers(STORED_FIELDS);
    });
  });
});
