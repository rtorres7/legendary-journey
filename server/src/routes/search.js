const express = require("express");
const router = express.Router();

const SearchService = require("../services/search.js");
const searchService = new SearchService(process.env.ES_URL);
const Metadata = require("../models/metadata");

const DISPLAY_NAMES = { producing_offices: 'Authored By Organizations' };

// GET home page features
router.get("/", (req, res) => {
  const term = req.query.text;
  (async() => {
    const results = await searchService.search(term, req.query.per_page, req.query.page, req.query.sort_dir, req.query);
    const aggregations = await resolveAggregations(results.aggregations);

    const highlightedResults = augmentResults(results);

    const searchResult = {
      searchId: '',
      results: highlightedResults,
      aggregations: aggregations,
      pages: Math.ceil(results.hits.total.value/req.query.per_page),
      totalCount: results.hits.total.value,
      siteEnhancement: '',
      daClassifError: ''
    }
    res.json(searchResult);
  })();
});

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

async function resolveAggregations(aggregations) {
  const metadata = await Metadata.findOne().lean();

  const resolvedAggs = {};
  Object.entries(aggregations).forEach((entry) => {
    const [key, value] = entry;

    const rows = value.buckets.map(bucket => {
      const values = typeof metadata.criteria[key].values === 'function' ? metadata.criteria[key] : metadata.criteria[key].values;

      const value = values.filter(item => item.code.toString() === bucket.key)[0];
      return {
        name: value === undefined ? 'Unknown' : value.name,
        key: bucket.key,
        count: bucket.doc_count
      }
    });

    const displayName = displayNameFor(metadata, key);

    resolvedAggs[key] = { displayName: displayName, rows: rows};
  });

  return resolvedAggs;
}

function displayNameFor(metadata, key) {
  if ('displayName' in metadata.criteria[key]) {
    return metadata.criteria[key].displayName;
  }
  return DISPLAY_NAMES[key];
}

module.exports = router;
