const Metadata = require("../models/metadata");
const { caching } = require("cache-manager");

class MetadataService {
  async initCache() {
    if (this.cache === undefined) {
      this.cache = await caching("memory", {
        ttl: 60 * 60 * 1000,
        max: 10,
      });
    }
  }

  async findTopicsFor(codes) {
    const lookups = await this.findAllLookups();
    return await this.findLookupsByCodes(lookups.topics.values, codes);
  }

  async findIssuesForTopics(topicCodes) {
    if (topicCodes === undefined || topicCodes === null) {
      return [];
    }

    const lookups = await this.findAllLookups();
    return await lookups.issues.values.filter((issue) => {
      return (
        issue.topics
          .map((topic) => topic.codes)
          .flat()
          .filter((code) => topicCodes.includes(code)).length > 0
      );
    });
  }

  async findProducingOfficesFor(codes) {
    const lookups = await this.findAllLookups();
    return await this.findLookupsByCodes(
      lookups.producing_offices.values,
      codes
    );
  }

  async findProductType(code) {
    const lookups = await this.findAllLookups();
    return await lookups.product_types.values.filter(
      (productType) => productType.code === code
    )[0];
  }

  async findReportingTypeFor(productTypeId) {
    const lookups = await this.findAllLookups();
    const types = await lookups.reporting_types.values.filter((reportingType) =>
      reportingType.productTypes.includes(productTypeId)
    );

    if (types.length === 0) {
      return { name: "", code: "" };
    }

    return types[0];
  }

  async findCountriesFor(codes) {
    const lookups = await this.findAllLookups();
    return await this.findLookupsByCodes(lookups.countries.values, codes);
  }

  async findSubRegionsForCountries(countries) {
    if (countries === undefined || countries === null) {
      return [];
    }

    const lookups = await this.findAllLookups();
    return await lookups.subregions.values.filter((subregion) => {
      return (
        subregion.country_codes.filter((code) => countries.includes(code))
          .length > 0
      );
    });
  }

  async findRegionsForSubRegions(subregions) {
    if (subregions === undefined || subregions === null) {
      return [];
    }

    const lookups = await this.findAllLookups();
    return await lookups.regions.values.filter((region) => {
      return (
        region.subregions.filter((code) => subregions.includes(code)).length > 0
      );
    });
  }

  async findCoauthorsFor(codes) {
    const lookups = await this.findAllLookups();
    return await this.findLookupsByCodes(lookups.coauthors.values, codes);
  }

  async findCoordinatorsFor(codes) {
    const lookups = await this.findAllLookups();
    return await this.findLookupsByCodes(lookups.coordinators.values, codes);
  }

  async findDissemOrgsFor(codes) {
    const lookups = await this.findAllLookups();
    return await this.findLookupsByCodes(lookups.dissem_orgs.values, codes);
  }

  async findNonStateActorsFor(codes) {
    const lookups = await this.findAllLookups();
    return await this.findLookupsByCodes(
      lookups.non_state_actors.values,
      codes
    );
  }

  async findLookupsByCodes(lookups, codes) {
    if (codes === undefined || lookups === undefined) {
      return [];
    }

    return lookups.filter((lookup) => codes.indexOf(lookup.code) >= 0);
  }

  async findAllLookups() {
    await this.initCache();

    return await this.cache.wrap("lookups", async () => {
      const metadata = await Metadata.findOne().lean().exec();

      if (metadata === undefined) {
        throw new Error("Unable to find metadata");
      }

      return metadata.criteria;
    });
  }

  async getAllMetadata() {
    await this.initCache();

    return await this.cache.wrap("metadata", async () => {
      return await Metadata.findOne().lean().exec();
    });
  }

  async clearCache() {
    if (this.cache) {
      await this.cache.reset();
    }
  }
}

module.exports = MetadataService;
