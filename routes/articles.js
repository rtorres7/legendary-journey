var express = require("express");
var router = express.Router();
const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

var Article = require("../models/articles");
var Metadata = require("../models/metadata");

const IndexService = require("../services/index.js");
const indexService = new IndexService();

// GET
router.get("/", (req, res) => {
  Article.find(
    {},
    "attributes doc_num title title_classification summary summary_classification date_published state",
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

//GET articles by date
router.get("/date/:date", (req, res) => {
  var start = dayjs(req.params.date).utc().startOf("day");
  var end = dayjs(req.params.date).utc().endOf("day");
  Article.find(
    {
      date_published: { $gte: start, $lte: end },
    },
    function (error, articles) {
      if (error) {
        console.error(error);
      }
      var articlesForDate = articles.map((article, index) => {
        return {
          attributes: {
            ...article.attributes,
            id: article._id,
            product_type: article.product_type,
            title_classif: article.title_classification,
            summary_classif: article.summary_classification,
            state: article.state,
          },
          data: { ...article.data },
        };
      });

      res.send(articlesForDate);
    }
  );
});

//GET articles by id
router.get("/:id", (req, res) => {
  Article.findById(req.params.id, function (error, article) {
    if (error) {
      console.error(error);
    }
    res.send(article);
  });
});

// POST
router.post("/", (req, res) => {
  var db = req.db;
  var article = new Article({
    date_published: req.body.date_published || dayjs.utc().format(),
    product_type_id: req.body.product_type_id,
    document_action: req.body.document_action,
    html_body: req.body.html_body,
    poc_info: req.body.poc_info,
    producing_office: req.body.producing_office,
    publication_number: req.body.publication_number,
    summary: req.body.summary,
    title: req.body.title,
    topics: req.body.topics,
    wire_id: req.body.wire_id,
  });

  article.save(function (error) {
    if (error) {
      console.log(error);
    }
    (async () => {
      await indexService.create(article.indexable);
    })();
    res.send(article);
  });
});

// Fetch single post
router.get("/:id/edit", (req, res) => {
  var db = req.db;
  Article.findById(
    req.params.id,
    "attributes doc_num title title_classification summary summary_classification date_published countries topics product_type_id html_body dissem_orgs images poc_info",
    function (error, article) {
      if (error) {
        console.error(error);
      }

      var article = article.toJSON();
      article.date_published = dayjs(req.body.date_published).format(
        "YYYY-MM-DD"
      );
      res.send(article);
    }
  );
});

router.get("/:id/view", function (req, res) {
  Article.findById(req.params.id, function (error, article) {
    if (error) {
      console.error(error);
    }
    res.send(article.data.details);
  });
});
function getCountriesByCodes(codes, metadata) {
  const countries = metadata.criteria.countries.values;
  const result = [];

  for (const code of codes) {
    const country = countries.find((c) => c.code === code);
    if (country) {
      result.push(country);
    }
  }

  return result;
}

function getTopicsByCodes(codes, metadata) {
  const topics = metadata.criteria.topics.values;
  const result = [];

  for (const code of codes) {
    const topic = topics.find((c) => c.code === code);
    if (topic) {
      result.push(topic);
    }
  }

  return result;
}

async function getMetadata() {
  const metadata = await Metadata.findOne().lean();
  return metadata;
}

// Update an article
router.put("/:id", (req, res) => {
  var db = req.db;

  (async () => {
    const metadata = await getMetadata();
    const countries = getCountriesByCodes(req.body.countries, metadata);
    const topics = getTopicsByCodes(req.body.topics, metadata);

    var article = {
      title: req.body.title,
      summary: req.body.summary,
      topics: topics,
      countries: countries,
      dissem_orgs: req.body.dissem_orgs,
      poc_info: req.body.poc_info,
      html_body: req.body.html_body,
      publication_number: req.body.publication_number,
      wire_id: req.body.wire_id,
      date_published: dayjs.utc(req.body.date_published, "YYYY-MM-DD"),
      //state: "draft",
      product_type_id: req.body.product_type_id,
    };

    Article.findByIdAndUpdate(
      { _id: req.params.id },
      article,
      function (error, article) {
        if (error) {
          console.error(error);
        }

        console.error("the article is ", article);

        (async () => {
          var result = await indexService.create(article.indexable);
          res.send({
            success: true,
            article: article,
            date: article.date_published,
            doc_num: article._id,
            id: article._id,
            state: "draft",
          });
        })();
      }
    );
  })();
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

module.exports = router;
