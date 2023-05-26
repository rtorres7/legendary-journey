const { Client } = require("@elastic/elasticsearch");
const constant = require("../util/constant.js");
const dayjs = require("dayjs");

class SearchService {
  constructor(esUrl=constant.esNode) {
    this.client = new Client({ node: esUrl });
    this.index = "products";
  }

  async search(term, perPage=10, page=1, sortMethod='desc', filters = {}) {
    const skipCount = (page - 1) * perPage;
    const sortClause = this.buildSortClause(sortMethod);

    const query = this.buildQueryFromFilters(term, filters);

    const searchParams = {
      index: this.index,
      from: skipCount,
      size: perPage,
      sort: [sortClause],
      aggs: {
        classification: {
          terms: {
            field: 'classification'
          }
        },
        countries: {
          terms: {
            field: 'countries'
          }
        },
        issues: {
          terms: {
            field: 'issues'
          }
        },
        producing_offices: {
          terms: {
            field: 'producingOffices'
          }
        },
        product_types: {
          terms: {
            field: 'productType'
          }
        },
        regions: {
          terms: {
            field: 'regions'
          }
        },
        reporting_types: {
          terms: {
            field: 'reportingType'
          }
        },
        subregions: {
          terms: {
            field: 'subregions'
          }
        },
        topics: {
          terms: {
            field: 'topics'
          }
        },
      },
      highlight: {
        fields: {
          htmlBody: {}
        }
      }
    };

    if (query !== null) {
      searchParams.query = query;
    }

    return await this.client.search(searchParams);
  }

  buildSortClause(sortMethod) {
    switch (sortMethod) {
      case 'desc':
        return { datePublished: { order: 'desc' }};
      case 'asc':
        return { datePublished: { order: 'asc' }};
      default:
        return { '_score': { order: 'desc' }};
    }
  }

  buildQueryFromFilters(term, filters) {
    const query = {};

    if (term !== undefined && term !== '') {
      query.match = { htmlBody: term };
    }

    if (filters.start_date !== undefined && filters.end_date !== undefined) {
      const start = dayjs(filters.start_date).startOf('day');
      const end = dayjs(filters.end_date).endOf('day');

      query.range = {
        datePublished: {
          gte: start,
          lte: end,
        }
      }
    }

    this.addAndClause(query, 'countries', filters.countries);
    this.addAndClause(query, 'regions', filters.regions);
    this.addAndClause(query, 'subregions', filters.subregions);
    this.addAndClause(query, 'topics', filters.topics);
    this.addAndClause(query, 'issues', filters.issues);
    this.addOrClause(query, 'classification', filters.classification);
    this.addOrClause(query, 'productType', filters.product_types);
    this.addOrClause(query, 'reportingType', filters.reporting_types);
    this.addOrClause(query, 'producingOffices', filters.producing_offices);

    if (Object.keys(query).length === 0) {
      return null;
    }

    return query;
  }

  addAndClause(query, term, filters) {
    if (filters === undefined || filters.length === 0) {
      return;
    }

    query.bool = query.bool || {};
    query.bool.filter = query.bool.filter || [];

    filters.forEach(filter => {
      const filterQuery = { term: {}};
      filterQuery.term[term] = filter;
      query.bool.filter.push(filterQuery);
    });
  }

  addOrClause(query, term, filters) {
    if (filters === undefined || filters.length === 0) {
      return;
    }

    query.bool = query.bool || {};
    query.bool.filter = query.bool.filter || [];

    const orClause = {
      bool: {
        should: []
      }
    };

    filters.forEach(filter => {
      const filterQuery = { term: {}};
      filterQuery.term[term] = filter;
      orClause.bool.should.push(filterQuery);
    });

    query.bool.filter.push(orClause);
  }
}

module.exports = SearchService;
