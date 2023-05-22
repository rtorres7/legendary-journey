const { Client } = require("@elastic/elasticsearch");
const constant = require("../util/constant.js");

class SearchService {
  constructor() {
    this.client = new Client({ node: constant.es_node });
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
        reporting_types: {
          terms: {
            field: 'reporting_type'
          }
        },
        topics: {
          terms: {
            field: 'topics'
          }
        },
        countries: {
          terms: {
            field: 'countries'
          }
        },
        product_types: {
          terms: {
            field: 'product_type'
          }
        },
        classification: {
          terms: {
            field: 'classification'
          }
        },
        producing_offices: {
          terms: {
            field: 'producing_offices'
          }
        },
      },
      highlight: {
        fields: {
          html_body: {}
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
        return { date_published: { order: 'desc' }};
      case 'asc':
        return { date_published: { order: 'asc' }};
      default:
        return { '_score': { order: 'desc' }};
    }
  }

  buildQueryFromFilters(term, filters) {
    const query = {};

    if (term !== undefined && term !== '') {
      query.match = { html_body: term };
    }

    this.addAndClause(query, 'countries', filters.countries);
    this.addAndClause(query, 'regions', filters.regions);
    this.addAndClause(query, 'subregions', filters.subregions);
    this.addAndClause(query, 'topics', filters.topics);
    this.addAndClause(query, 'issues', filters.issues);
    this.addAndClause(query, 'classification', filters.classification);
    this.addOrClause(query, 'product_type_id', filters.product_types);
    this.addOrClause(query, 'reporting_type', filters.reporting_types);
    this.addOrClause(query, 'producing_offices', filters.producing_offices);

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
