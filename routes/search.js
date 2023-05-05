const express = require("express");
const router = express.Router();

const SearchService = require("../services/search.js");
const searchService = new SearchService();

// GET home page features
router.get("/", (req, res) => {
  const term = req.query.text;
  (async() => {
    const results = await searchService.search(term);

    const searchResult = {
      searchId: '',
      results: results.hits.hits.map((hit) => { return hit._source }),
      aggregations: [],
      pages: Math.ceil(results.hits.total.value/req.query.per_page),
      totalCount: results.hits.total.value,
      siteEnhancement: '',
      daClassifError: ''
    }
    res.send(searchResult);
  })();

});

module.exports = router;
