const express = require("express");
const router = express.Router();

const ProductSearchService = require("../services/product-search-service");
const searchService = new ProductSearchService(process.env.ES_URL);

// GET home page features
router.get("/", (req, res) => {
  const term = req.query.text;
  (async() => {
    const results = await searchService.search(term, req.query.per_page, req.query.page, req.query.sort_dir, req.query);
    res.json(results);
  })();
});

module.exports = router;
