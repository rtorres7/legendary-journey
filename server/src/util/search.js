const dayjs = require("dayjs");
const MetadataService = require("../services/metadata");
const metadataService = new MetadataService();

async function runSearchOne(productNum) {
  const searchOneParams = {
    index: "products",
    query: {
      bool: {
        must: [
          {
            match: {
              productNumber: productNum,
            },
          },
          {
            match: {
              deleted: false,
            },
          },
        ],
      },
    },
  };

  const client = require("../data/elasticsearch");
  const results = await client.search(searchOneParams);

  if (results.hits.hits.length === 0) {
    return null;
  }

  return results.hits.hits[0]._id;
}

async function runRelatedSearch(product) {
  const productSearchOne = await runSearchOne(product);

  if (productSearchOne === null) {
    return { relatedDocuments: [] };
  }

  const relatedParams = {
    index: "products",

    query: {
      more_like_this: {
        fields: ["title", "html_body", "summary", "topics", "countries"],
        like: [
          {
            _index: "products",
            _id: productSearchOne,
          },
        ],
        min_term_freq: 1,
        max_query_terms: 12,
      },
    },
  };

  const client = require("../data/elasticsearch");
  const results = await client.search(relatedParams);

  const relatedJSON = [];
  let i = 1;
  results.hits.hits
    .filter((hit) => {
      return hit._source.deleted !== true;
    })
    .map((hit) => {
      if (i < 6) {
        relatedJSON.push({
          id: hit._id,
          position: i,
          document_id: product,
          document: {
            id: hit._source.id,
            doc_link: hit._source.productNumber,
            doc_num: hit._source.productNumber,
            title: hit._source.title,
            title_classification: hit._source.titleClassification,
          },
        });
      }
      i++;
    });

  return { relatedDocuments: relatedJSON };
}

async function runSearch(
  term,
  indexName,
  perPage = 10,
  page = 1,
  sortMethod = "desc",
  filters = {},
  fields = [],
) {
  const skipCount = (page - 1) * perPage;
  const sortClause = buildSortClause(sortMethod);
  const query = buildQueryFromFilters(term, filters, fields);
  const aggregations = buildAggregations(
    fields.filter((field) => field.aggregation !== undefined),
  );

  const searchParams = {
    index: indexName,
    from: skipCount,
    size: perPage,
    sort: [sortClause],
    aggs: aggregations,
    highlight: {
      fields: {
        htmlBody: {},
        "pdfVersion.content": {},
      },
    },
  };

  if (query !== null) {
    searchParams.query = query;
  }

  const client = require("../data/elasticsearch");
  const results = await client.search(searchParams);
  const aggregationResults = await resolveAggregations(results.aggregations);
  const highlightedResults = augmentResults(results);

  return {
    searchId: "",
    results: highlightedResults,
    aggregations: aggregationResults,
    pages: Math.ceil(results.hits.total.value / perPage),
    totalCount: results.hits.total.value,
    siteEnhancement: "",
    daClassifError: "",
  };
}

function buildSortClause(sortMethod) {
  switch (sortMethod) {
    case "desc":
      return { datePublished: { order: "desc" } };
    case "asc":
      return { datePublished: { order: "asc" } };
    default:
      return { _score: { order: "desc" } };
  }
}

function buildQueryFromFilters(term, filters, fields) {
  const query = {};
  query.bool = {};
  query.bool.must = [];

  if (term !== undefined && term !== "") {
    query.bool.must.push({
      multi_match: {
        query: term,
        fields: ["title", "htmlBody", "pdfVersion.content"],
      },
    });
  }
  query.bool.must.push({ match: { state: "posted" } });
  query.bool.must.push({ match: { deleted: false } });

  if (filters.id !== undefined) {
    query.bool.should = [];
    for (const productId of filters.id) {
      query.bool.should.push({ match: { id: productId } });
    }
    query.bool.minimum_should_match = 1;
  }

  if (filters.start_date !== undefined && filters.end_date !== undefined) {
    const start = dayjs(filters.start_date).startOf("day");
    const end = dayjs(filters.end_date).endOf("day");

    query.bool.must.push({
      range: {
        datePublished: {
          gte: start,
          lte: end,
        },
      },
    });
  }

  fields
    .filter((field) => field.filterType !== undefined)
    .forEach((field) => {
      if (field.filterType === "AND") {
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

  filters.forEach((filter) => {
    const filterQuery = { term: {} };
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
      should: [],
    },
  };

  filters.forEach((filter) => {
    const filterQuery = { term: {} };
    filterQuery.term[term] = filter;
    orClause.bool.should.push(filterQuery);
  });

  query.bool.filter.push(orClause);
}

function buildAggregations(fields) {
  return fields.reduce((agg, field) => {
    return {
      ...agg,
      [field["aggregation"]]: { terms: { field: field["field"] } },
    };
  }, {});
}

async function resolveAggregations(aggregations) {
  const lookups = await metadataService.findAllLookups();

  const resolvedAggs = {};
  Object.entries(aggregations).forEach((entry) => {
    const [key, value] = entry;

    const rows = value.buckets.map((bucket) => {
      const values = lookups[key].values;

      const value = values.filter(
        (item) => item.code.toString() === bucket.key,
      )[0];
      return {
        name: value === undefined ? "Unknown" : value.name,
        key: bucket.key,
        count: bucket.doc_count,
      };
    });

    const displayName = lookups[key].displayName;

    resolvedAggs[key] = { displayName: displayName, rows: rows };
  });

  return resolvedAggs;
}

function augmentResults(results) {
  return results.hits.hits.map((hit) => {
    if (hit.highlight === undefined) {
      return adjustResultsForUI(hit._source);
    }

    const highlightedResult =
      hit.highlight.htmlBody || hit.highlight["pdfVersion.content"];

    return {
      ...adjustResultsForUI(hit._source),
      highlighted_result: highlightedResult,
    };
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
  result.needed = result.needed?.orgs?.length > 0 ? result.needed : {};
  result.org_restricted = result.orgRestricted;
  result.doc_num = result.productNumber;

  return result;
}

module.exports = { runSearch, runRelatedSearch };
