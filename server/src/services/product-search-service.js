const { Client } = require("@elastic/elasticsearch");
const constant = require("../util/constant.js");
const dayjs = require("dayjs");

const PRODUCT_FIELDS = [
  { field: 'classification', aggregation: 'classification', filters: 'classification', filterType: 'OR' },
  { field: 'countries', aggregation: 'countries', filters: 'countries', filterType: 'AND' },
  { field: 'issues', aggregation: 'issues', filters: 'issues', filterType: 'AND' },
  { field: 'nonStateActors', aggregation: 'non_state_actors'},
  { field: 'producingOffices', aggregation: 'producing_offices', filters: 'producing_offices', filterType: 'OR' },
  { field: 'productType', aggregation: 'product_types', filters: 'product_types', filterType: 'OR' },
  { field: 'regions', aggregation: 'regions', filters: 'regions', filterType: 'AND' },
  { field: 'reportingType', aggregation: 'reporting_types', filters: 'reporting_types', filterType: 'OR' },
  { field: 'subregions', aggregation: 'subregions', filters: 'subregions', filterType: 'AND' },
  { field: 'topics', aggregation: 'topics', filters: 'topics', filterType: 'AND' },
]

class ProductSearchService {
  constructor(esUrl=constant.esNode) {
    this.client = new Client({ node: esUrl });
    this.index = "products";
  }

  async search(term, perPage=10, page=1, sortMethod='desc', filters = {}) {
    const skipCount = (page - 1) * perPage;
    const sortClause = this.#buildSortClause(sortMethod);
    const query = this.#buildQueryFromFilters(term, filters);
    const aggregations = this.#buildAggregations();

    const searchParams = {
      index: this.index,
      from: skipCount,
      size: perPage,
      sort: [sortClause],
      aggs: aggregations,
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

  #buildSortClause(sortMethod) {
    switch (sortMethod) {
      case 'desc':
        return { datePublished: { order: 'desc' }};
      case 'asc':
        return { datePublished: { order: 'asc' }};
      default:
        return { '_score': { order: 'desc' }};
    }
  }

  #buildQueryFromFilters(term, filters) {
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

    PRODUCT_FIELDS
      .filter(field => { return field.filterType !== undefined })
      .forEach(field => {
        if (field.filterType === 'AND') {
          this.#addAndClause(query, field.field, filters[field.filters]);
        } else if (field.filterType === 'OR') {
          this.#addOrClause(query, field.field, filters[field.filters]);
        }
      });

    if (Object.keys(query).length === 0) {
      return null;
    }

    return query;
  }

  #addAndClause(query, term, filters) {
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

  #addOrClause(query, term, filters) {
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

  #buildAggregations() {
    return PRODUCT_FIELDS.reduce((agg, field) => {
      return {
        ...agg,
        [field['aggregation']]: { terms: { field: field['field'] } },
      };
    }, {});
  }

  async create(product) {
    await this.client.index({
      index: this.index,
      id: product.id,
      document: product,
    });
  }

  async update(product) {
    const { document } = await this.client.update({
      index: this.index,
      id: product.id,
      body: {
        doc: {
          ...product,
        },
      },
    });

    return document;
  }

  async delete(id) {
    await this.client.delete({
      index: this.index,
      id,
    });
  }
}

module.exports = ProductSearchService;
