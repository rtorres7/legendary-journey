const { Client } = require("@elastic/elasticsearch");
const MetadataService = require('./metadata');
const constant = require("../util/constant.js");
const dayjs = require("dayjs");

const PRODUCT_FIELDS = [
  { field: 'classification', aggregation: 'classification', filters: 'classification', filterType: 'OR' },
  { field: 'countries', aggregation: 'countries', filters: 'countries', filterType: 'AND' },
  { field: 'issues', aggregation: 'issues', filters: 'issues', filterType: 'AND' },
  { field: 'nonStateActors', aggregation: 'non_state_actors', filters: 'nonStateActors', filterType: 'AND'},
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
    this.metadataService = new MetadataService();
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

    const results = await this.client.search(searchParams);
    const aggregationResults = await this.#resolveAggregations(results.aggregations);
    const highlightedResults = this.#augmentResults(results);

    return {
      searchId: '',
      results: highlightedResults,
      aggregations: aggregationResults,
      pages: Math.ceil(results.hits.total.value/perPage),
      totalCount: results.hits.total.value,
      siteEnhancement: '',
      daClassifError: ''
    }
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
        } else {
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

  async #resolveAggregations(aggregations) {
    const lookups = await this.metadataService.findAllLookups();

    const resolvedAggs = {};
    Object.entries(aggregations).forEach((entry) => {
      const [key, value] = entry;

      const rows = value.buckets.map(bucket => {
        const values = lookups[key].values;

        const value = values.filter(item => item.code.toString() === bucket.key)[0];
        return {
          name: value === undefined ? 'Unknown' : value.name,
          key: bucket.key,
          count: bucket.doc_count
        }
      });

      const displayName = lookups[key].displayName;

      resolvedAggs[key] = { displayName: displayName, rows: rows};
    });

    return resolvedAggs;
  }

  #augmentResults(results) {
    return results.hits.hits.map(hit => {
      if (hit.highlight === undefined) {
        return this.#adjustResultsForUI(hit._source);
      }
      return { ...(this.#adjustResultsForUI(hit._source)), highlighted_result: hit.highlight.htmlBody };
    });
  }

  // TODO: This can go away once the UI is updated with the new model/fields
  #adjustResultsForUI(result) {
    result.title_classification = result.titleClassification;
    result.title_classif = result.titleClassification;
    result.summary_classification = result.summaryClassification;
    result.summary_classif = result.summaryClassification;
    result.date_published = result.datePublished;
    result.html_body = result.htmlBody;
    result.needed = result.needed && result.needed.orgs && result.needed.orgs.length > 0 ? result.needed : {};
    result.org_restricted = result.orgRestricted;
    result.doc_num = result.productNumber;

    return result;
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
