var express = require("express");
var router = express.Router();

const arxiv = require("arxiv-api");

var Article = require("../models/articles");

// GET
router.get("/", (req, res) => {
  Article.find({}, "title description", function (error, articles) {
    if (error) {
      console.error(error);
    }
    res.send({
      articles: articles,
    });
  }).sort({ _id: -1 });
});

// POST
router.post("/", (req, res) => {
  var db = req.db;
  var title = req.body.title;
  var description = req.body.description;
  var new_article = new Article({
    title: title,
    description: description,
  });

  new_article.save(function (error) {
    if (error) {
      console.log(error);
    }
    res.send({
      success: true,
      message: "Article saved successfully!",
    });
  });
});

// Fetch single post
router.get("/:id", (req, res) => {
  var db = req.db;
  Article.findById(
    req.params.id,
    "title description",
    function (error, article) {
      if (error) {
        console.error(error);
      }
      res.send(article);
    }
  );
});

// Update an article
router.put("/:id", (req, res) => {
  var db = req.db;
  Article.findById(
    req.params.id,
    "title description",
    function (error, article) {
      if (error) {
        console.error(error);
      }

      article.title = req.body.title;
      article.description = req.body.description;
      article.save(function (error) {
        if (error) {
          console.log(error);
        }
        res.send({
          success: true,
        });
      });
    }
  );
});

// Delete an article
router.delete("/:id", (req, res) => {
  var db = req.db;
  Article.remove(
    {
      _id: req.params.id,
    },
    function (err, article) {
      if (err) res.send(err);
      res.send({
        success: true,
      });
    }
  );
});

/* router.get("/articles", (req, res) => {
  const papers = arxiv
    .search({
      searchQueryParams: [
        {
          include: [{ name: "cs.*" }],
        },
        {
          include: [{ name: "econ.*" }],
        },
      ],
      start: 0,
      maxResults: 10,
    })
    .then((papers) => res.send(papers))
    .catch((error) => console.log(error));
});

router.get("/article/:id", (req, res) => {
  const id = Number(req.params.id);
  const article = null; //TODO
  res.send(article);
}); */

module.exports = router;
