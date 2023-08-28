const mongoose = require("mongoose");
const { MongoExtension } = require("@kiwiproject/kiwi-test-js");

const MetadataService = require("../../src/services/metadata");
const { loadMetadata } = require("../__utils__/dataLoader");

describe('MetadataService', () => {
  let service;
  let mongoUrl;

  beforeAll(async() => {
    mongoUrl = MongoExtension.getMongoUriWithDb("metadata");
    await loadMetadata(mongoUrl);
  });

  beforeEach(async () => {
    await mongoose.connect(mongoUrl, { useNewUrlParser: true });
    service = new MetadataService();
  });

  afterEach(() => {
    mongoose.connection.close();
    service.clearCache();
  });

  afterAll(async () => {
    await MongoExtension.dropDatabase("metadata");
  });

  describe('findTopicsFor', () => {
    it('should return list of topics that match a single code', async () => {
      const result = await service.findTopicsFor(['ACR']);

      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual("Annexation of Crimea");
      expect(result[0].code).toEqual("ACR");
    });

    it('should return list of topics that match a list of codes', async () => {
      const result = await service.findTopicsFor(['ACR', 'BRL']);

      expect(result).toHaveLength(2);

      const names = result.map(r => r.name);
      const codes = result.map(r => r.code);

      expect(names).toEqual(['Annexation of Crimea', 'Belarus Relations']);
      expect(codes).toEqual(['ACR', 'BRL']);
    });

    it('should return empty list of topics when no codes match', async () => {
      const result = await service.findTopicsFor(['TBD']);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of topics when no codes given', async () => {
      const result = await service.findTopicsFor([]);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of topics when codes is undefined', async () => {
      const result = await service.findTopicsFor(undefined);
      expect(result).toHaveLength(0);
    });
  });

  describe('findIssuesForTopics', () => {
    it('should return list of issues that match a single code', async () => {
      const result = await service.findIssuesForTopics(['ACR']);

      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual("Ukraine War");
      expect(result[0].code).toEqual("UW");
    });

    it('should return list of issues that match a list of codes', async () => {
      const result = await service.findIssuesForTopics(['ACR', 'BRL']);

      expect(result).toHaveLength(2);

      const names = result.map(r => r.name);
      const codes = result.map(r => r.code);

      expect(names).toEqual(['Eastern Europe Geopolitics', 'Ukraine War']);
      expect(codes).toEqual(['EEG', 'UW']);
    });

    it('should return empty list of issues when no codes match', async () => {
      const result = await service.findIssuesForTopics(['TBD']);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of issues when no codes given', async () => {
      const result = await service.findIssuesForTopics([]);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of issues when codes is null', async () => {
      const result = await service.findIssuesForTopics(null);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of topics when codes is undefined', async () => {
      const result = await service.findIssuesForTopics(undefined);
      expect(result).toHaveLength(0);
    });
  });

  describe('findProducingOfficesFor', () => {
    it('should return list of producing offices that match a single code', async () => {
      const result = await service.findProducingOfficesFor(['ANCESTRY']);

      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual("ANCESTRY");
      expect(result[0].code).toEqual("ANCESTRY");
    });

    it('should return list of producing offices that match a list of codes', async () => {
      const result = await service.findProducingOfficesFor(['ANCESTRY', 'COMMERCE']);

      expect(result).toHaveLength(2);

      const names = result.map(r => r.name);
      const codes = result.map(r => r.code);

      expect(names).toEqual(['ANCESTRY', 'COMMERCE']);
      expect(codes).toEqual(['ANCESTRY', 'COMMERCE']);
    });

    it('should return empty list of producing offices when no codes match', async () => {
      const result = await service.findProducingOfficesFor(['OTHER']);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of producing offices when no codes given', async () => {
      const result = await service.findProducingOfficesFor([]);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of producing offices when codes is undefined', async () => {
      const result = await service.findProducingOfficesFor(undefined);
      expect(result).toHaveLength(0);
    });
  });

  describe('findProductType', () => {
    it('should return product type that matches a given code', async () => {
      const result = await service.findProductType(10376);

      expect(result.name).toEqual("Current");
      expect(result.code).toEqual(10376);
    });

    it('should return undefined when code does not match', async () => {
      const result = await service.findProductType(1);
      expect(result).toBeUndefined();
    });
  });

  describe('findReportingTypeFor', () => {
    it('should return reporting type that matches a given code', async () => {
      const result = await service.findReportingTypeFor(10376);

      expect(result.name).toEqual("Analysis: All Source");
      expect(result.code).toEqual("analysis.all_source");
    });

    it('should return empty reporting type when code does not match', async () => {
      const result = await service.findReportingTypeFor(1);
      expect(result.name).toEqual("");
      expect(result.code).toEqual("");
    });
  });

  describe('findCountriesFor', () => {
    it('should return list of countries that match a single code', async () => {
      const result = await service.findCountriesFor(['AFG']);

      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual("Afghanistan");
      expect(result[0].code).toEqual("AFG");
    });

    it('should return list of countries that match a list of codes', async () => {
      const result = await service.findCountriesFor(['AFG', 'ALA']);

      expect(result).toHaveLength(2);

      const names = result.map(r => r.name);
      const codes = result.map(r => r.code);

      expect(names).toEqual(['Afghanistan', 'Aland Islands']);
      expect(codes).toEqual(['AFG', 'ALA']);
    });

    it('should return empty list of countries when no codes match', async () => {
      const result = await service.findCountriesFor(['TBD']);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of countries when no codes given', async () => {
      const result = await service.findCountriesFor([]);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of countries when codes is undefined', async () => {
      const result = await service.findCountriesFor(undefined);
      expect(result).toHaveLength(0);
    });
  });

  describe('findSubRegionsForCountries', () => {
    it('should return list of subregions that match a single code', async () => {
      const result = await service.findSubRegionsForCountries(['AFG']);

      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual("Asia, South");
      expect(result[0].code).toEqual("ASso");
    });

    it('should return list of subregions that match a list of codes', async () => {
      const result = await service.findSubRegionsForCountries(['AFG', 'ALA']);

      expect(result).toHaveLength(2);

      const names = result.map(r => r.name);
      const codes = result.map(r => r.code);

      expect(names).toEqual(['Asia, South', 'Europe, North']);
      expect(codes).toEqual(['ASso', 'EUno']);
    });

    it('should return empty list of subregions when no codes match', async () => {
      const result = await service.findSubRegionsForCountries(['TBD']);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of subregions when no codes given', async () => {
      const result = await service.findSubRegionsForCountries([]);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of subregions when codes is null', async () => {
      const result = await service.findSubRegionsForCountries(null);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of subregions when codes is undefined', async () => {
      const result = await service.findSubRegionsForCountries(undefined);
      expect(result).toHaveLength(0);
    });
  });

  describe('findRegionsForSubRegions', () => {
    it('should return list of regions that match a single code', async () => {
      const result = await service.findRegionsForSubRegions(['ASso']);

      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual("Asia");
      expect(result[0].code).toEqual("AS");
    });

    it('should return list of regions that match a list of codes', async () => {
      const result = await service.findRegionsForSubRegions(['ASso', 'EUno']);

      expect(result).toHaveLength(2);

      const names = result.map(r => r.name);
      const codes = result.map(r => r.code);

      expect(names).toEqual(['Asia', 'Europe']);
      expect(codes).toEqual(['AS', 'EU']);
    });

    it('should return empty list of regions when no codes match', async () => {
      const result = await service.findRegionsForSubRegions(['TBD']);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of regions when no codes given', async () => {
      const result = await service.findRegionsForSubRegions([]);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of regions when codes is null', async () => {
      const result = await service.findRegionsForSubRegions(null);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of regions when codes is undefined', async () => {
      const result = await service.findRegionsForSubRegions(undefined);
      expect(result).toHaveLength(0);
    });
  });

  describe('findCoauthorsFor', () => {
    it('should return list of coauthors that match a single code', async () => {
      const result = await service.findCoauthorsFor(['ANCESTRY']);

      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual("ANCESTRY");
      expect(result[0].code).toEqual("ANCESTRY");
    });

    it('should return list of coauthors that match a list of codes', async () => {
      const result = await service.findCoauthorsFor(['ANCESTRY', 'COMMERCE']);

      expect(result).toHaveLength(2);

      const names = result.map(r => r.name);
      const codes = result.map(r => r.code);

      expect(names).toEqual(['ANCESTRY', 'COMMERCE']);
      expect(codes).toEqual(['ANCESTRY', 'COMMERCE']);
    });

    it('should return empty list of coauthors when no codes match', async () => {
      const result = await service.findCoauthorsFor(['OTHER']);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of coauthors when no codes given', async () => {
      const result = await service.findCoauthorsFor([]);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of coauthors when codes is undefined', async () => {
      const result = await service.findCoauthorsFor(undefined);
      expect(result).toHaveLength(0);
    });
  });

  describe('findCoordinatorsFor', () => {
    it('should return list of coordinators that match a single code', async () => {
      const result = await service.findCoordinatorsFor(['ANCESTRY']);

      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual("ANCESTRY");
      expect(result[0].code).toEqual("ANCESTRY");
    });

    it('should return list of coordinators that match a list of codes', async () => {
      const result = await service.findCoordinatorsFor(['ANCESTRY', 'COMMERCE']);

      expect(result).toHaveLength(2);

      const names = result.map(r => r.name);
      const codes = result.map(r => r.code);

      expect(names).toEqual(['ANCESTRY', 'COMMERCE']);
      expect(codes).toEqual(['ANCESTRY', 'COMMERCE']);
    });

    it('should return empty list of coordinators when no codes match', async () => {
      const result = await service.findCoordinatorsFor(['OTHER']);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of coordinators when no codes given', async () => {
      const result = await service.findCoordinatorsFor([]);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of coordinators when codes is undefined', async () => {
      const result = await service.findCoordinatorsFor(undefined);
      expect(result).toHaveLength(0);
    });
  });

  describe('findDissemOrgsFor', () => {
    it('should return list of dissem orgs that match a single code', async () => {
      const result = await service.findDissemOrgsFor(['ANCESTRY']);

      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual("ANCESTRY");
      expect(result[0].code).toEqual("ANCESTRY");
    });

    it('should return list of dissem orgs that match a list of codes', async () => {
      const result = await service.findDissemOrgsFor(['ANCESTRY', 'COMMERCE']);

      expect(result).toHaveLength(2);

      const names = result.map(r => r.name);
      const codes = result.map(r => r.code);

      expect(names).toEqual(['ANCESTRY', 'COMMERCE']);
      expect(codes).toEqual(['ANCESTRY', 'COMMERCE']);
    });

    it('should return empty list of dissem orgs when no codes match', async () => {
      const result = await service.findDissemOrgsFor(['OTHER']);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of dissem orgs when no codes given', async () => {
      const result = await service.findDissemOrgsFor([]);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of dissem orgs when codes is undefined', async () => {
      const result = await service.findDissemOrgsFor(undefined);
      expect(result).toHaveLength(0);
    });
  });

  describe('findNonStateActorsFor', () => {
    it('should return list of non state actors that match a single code', async () => {
      const result = await service.findNonStateActorsFor(['EU']);

      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual("EU");
      expect(result[0].code).toEqual("EU");
    });

    it('should return list of non state actors that match a list of codes', async () => {
      const result = await service.findNonStateActorsFor(['EU', 'NATO']);

      expect(result).toHaveLength(2);

      const names = result.map(r => r.name);
      const codes = result.map(r => r.code);

      expect(names).toEqual(['EU', 'NATO']);
      expect(codes).toEqual(['EU', 'NATO']);
    });

    it('should return empty list of non state actors when no codes match', async () => {
      const result = await service.findNonStateActorsFor(['TBD']);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of non state actors when no codes given', async () => {
      const result = await service.findNonStateActorsFor([]);
      expect(result).toHaveLength(0);
    });

    it('should return empty list of non state actors when codes is undefined', async () => {
      const result = await service.findNonStateActorsFor(undefined);
      expect(result).toHaveLength(0);
    });
  });

  describe('findLookkupsByCodes', () => {
    it('should return empty list when lookups is undefined', async () => {
      const result = await service.findLookupsByCodes(undefined, []);
      expect(result).toHaveLength(0);
    });
  });

  describe('getAllMetadata', () => {
    it('should return the full metadata object', async () => {
      const metadata = await service.getAllMetadata();

      expect(metadata).toBeDefined();
      expect(metadata.criteria).toBeDefined();
    });

    it('should use cache on second access', async () => {
      await service.getAllMetadata();
      const metadata = await service.getAllMetadata();

      expect(metadata).toBeDefined();
      expect(metadata.criteria).toBeDefined();
    });
  });
});
