const dayjs = require("dayjs");
const MetadataService = require('../services/metadata');
const metadataService = new MetadataService();

async function runSearch(term, indexName, perPage=10, page=1, sortMethod='desc', filters = {}, fields = []) {
  const skipCount = (page - 1) * perPage;
  const sortClause = buildSortClause(sortMethod);
  const query = buildQueryFromFilters(term, filters, fields);
  const aggregations = buildAggregations(fields.filter(field => field.aggregation !== undefined));

  const searchParams = {
    index: indexName,
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

  const client = require('../data/elasticsearch');
  const results = await client.search(searchParams);
  const aggregationResults = await resolveAggregations(results.aggregations);
  const highlightedResults = augmentResults(results);

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

function buildSortClause(sortMethod) {
  switch (sortMethod) {
    case 'desc':
      return { datePublished: { order: 'desc' }};
    case 'asc':
      return { datePublished: { order: 'asc' }};
    default:
      return { '_score': { order: 'desc' }};
  }
}

function buildQueryFromFilters(term, filters, fields) {
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

  fields
    .filter(field => { return field.filterType !== undefined })
    .forEach(field => {
      if (field.filterType === 'AND') {
        addAndClause(query, field.field, filters[field.filters]);
      } else {
        addOrClause(query, field.field, filters[field.filters]);
      }
    });

  if (Object.keys(query).length === 0) {
    return null;
  }

  return query;
}

function addAndClause(query, term, filters) {
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

function addOrClause(query, term, filters) {
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

function buildAggregations(fields) {
  return fields.reduce((agg, field) => {
    return {
      ...agg,
      [field['aggregation']]: { terms: { field: field['field'] } },
    };
  }, {});
}

async function resolveAggregations(aggregations) {
  const lookups = await metadataService.findAllLookups();

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

function augmentResults(results) {
  return results.hits.hits.map(hit => {
    if (hit.highlight === undefined) {
      return adjustResultsForUI(hit._source);
    }
    return { ...(adjustResultsForUI(hit._source)), highlighted_result: hit.highlight.htmlBody };
  });
}

// TODO: This can go away once the UI is updated with the new model/fields
function adjustResultsForUI(result) {
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

module.exports = runSearch;
