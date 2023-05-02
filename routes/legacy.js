var express = require("express");
var router = express.Router();
const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

var Article = require("../models/articles");
var SpecialEditions = require("../models/special_editions");
var DissemOrgs = require("../models/dissem_orgs");

router.get(
  "/:date_published/articles/:id/getDocumentData",
  function (req, res) {
    var date_published = req.params.date_published;
    var id = req.params.id;
    Article.findById(id, function (error, article) {
      if (error) {
        console.error(error);
      }
      res.send(article.data.document);
    });
  }
);

router.get("/get_dissem_orgs", function (req, res) {
  DissemOrgs.find({}, function (error, dissem_orgs) {
    if (error) {
      console.error(error);
    }
    res.send({ dissem_orgs });
  });
});

router.get("/documents/:id.json", function (req, res) {
  Article.findById(req.params.id, function (error, article) {
    if (error) {
      console.error(error);
    }
    res.send(article.data.details);
  });
});

router.get("/user_data", function (req, res) {
  res.redirect("/users/");
});

router.get("/links", function (req, res, next) {
  SpecialEditions.findOne({}, function (error, special_editions) {
    if (error) {
      console.error(error);
    }
    res.send(special_editions);
  });
});

router.get("/:doc_num", function (req, res) {
  Article.findById(req.params.doc_num, function (error, article) {
    if (error) {
      console.error(error);
    }
    res.send(article.data.document);
  });
});

router.get("/:date_published/getWireByDate", function (req, res) {
  var start = dayjs(req.params.date_published).startOf("day");
  var end = dayjs(req.params.date_published).endOf("day");
  Article.find(
    { date_published: { $gte: start, $lte: end } },
    function (error, article) {
      if (error) {
        console.error(error);
      }

      var articlesForWire = article.map((article, index) => {
        return {
          attributes: {
            ...article.attributes,
            id: article._id,
            product_type: article.product_type,
            title_classif: article.title_classification,
            summary_classif: article.summary_classification,
            state: article.state,
          },
          //data: { ...article.data },
        };
      });

      console.log(articlesForWire);

      res.send(articlesForWire);
    }
  );
});

router.put("/:date_published/articles/:id/visitorCount", function (req, res) {
  var product_type_id = req.query.product_type_id;
  var id = req.query.id;
  res.status(200).json({
    success: true,
  });
});

router.get("/:doc_num/metrics/basic_metrics.json", function (req, res) {
  Article.findById(
    req.params.doc_num,
    "readership uniqueReadership",
    function (error, article) {
      if (error) {
        console.error(error);
      }
      res.send({
        metrics: {
          readership: article.readership,
          uniqueReadership: article.uniqueReadership,
        },
      });
    }
  );
});

module.exports = router;
