var express = require("express");
var router = express.Router();
const moment = require("moment");
const arxiv = require("arxiv-api");

var Article = require("../models/articles");

// GET
router.get("/", (req, res) => {
  Article.find(
    {},
    "attributes doc_num title title_classification summary summary_classification date_published",
    function (error, articles) {
      if (error) {
        console.error(error);
      }
      res.send({
        woah: {
          articles: articles,
          featured: articles.slice(0, 3),
          secondary: articles.slice(3, articles.length),
          briefs: articles.slice(0, 3), //TODO: need to only return sit awareness
        },
      });
    }
  ).sort({ _id: -1 });
});

// POST
router.post("/", (req, res) => {
  var db = req.db;
  var title = req.body.title;
  var title_classification = req.body.title_classification;
  var summary = req.body.summary;
  var summary_classification = req.body.summary_classification;
  var date_published = moment.utc();
  var new_article = new Article({
    attributes: {
      title: title,
      title_classification: title_classification,
      summary: summary,
      summary_classification: summary_classification,
      date_published: date_published,
    },
  });

  new_article.save(function (error) {
    if (error) {
      console.log(error);
    }
    res.send({
      success: true,
      message: "Article saved successfully!",
      article: new_article,
    });
  });
});

// Fetch single post
router.get("/:id", (req, res) => {
  var db = req.db;
  Article.findById(
    req.params.id,
    "attributes doc_num title title_classification summary summary_classification date_published",
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
    "attributes doc_num title title_classification summary summary_classification date_published",
    function (error, article) {
      if (error) {
        console.error(error);
      }

      article.title = req.body.title;
      article.title_classification = req.body.title_classification;
      article.summary = req.body.summary;
      article.summary_classification = req.body.summary_classification;
      article.date_published = req.body.date_published;
      article.save(function (error) {
        if (error) {
          console.log(error);
        }
        res.send({
          success: true,
          article: article,
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

//TODO need to return date, id, doc_num
//{"title":"15 January 2023 Current","summary":"","topics":["TERR"],"poc_info":"NCTC/DI Managing Editor, 932-4533 (secure), (571) 280-3627 (open)","document_action":"create","html_body":"<p></p>","producing_office":"DNI/NCTC","publication_number":11914421479,"wire_id":"2023-01-15"}
// router.post("/processDocument", (req, res) => {
//   res.send({
//     success: true,
//   });
// });

//TODO need to return date, id, doc_num
//{"title":"15 January 2023 Current","summary":"","topics":["TERR"],"poc_info":"NCTC/DI Managing Editor, 932-4533 (secure), (571) 280-3627 (open)","document_action":"create","html_body":"<p></p>","producing_office":"DNI/NCTC","publication_number":11914421479,"wire_id":"2023-01-15"}
router.post("/processDocument", (req, res) => {
  var new_article = new Article({
    //attributes: {
    title: req.body.title,
    summary: req.body.summary,
    topics: req.body.topics,
    poc_info: req.body.poc_info,
    html_body: req.body.html_body,
    publication_number: req.body.publication_number,
    wire_id: req.body.wire_id,
    date_published: moment.utc(),
    doc_num: this._id,
    id: this._id,
    //},
  });

  new_article.save(function (error) {
    if (error) {
      console.log(error);
    }
    res.send({
      article: new_article,
      date: moment.utc(),
      doc_num: new_article._id,
      id: new_article._id,
    });
  });
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
