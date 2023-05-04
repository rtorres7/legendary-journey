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
      var articlesForDate = articles.map((article) => {
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
    res.send(article.data.document);
  });
});

// POST (adapter to support /processDocument while working towards splitting it up)
router.post("/processDocument", (req, res) => {
  switch (req.body.document_action) {
    case 'create':
      res.redirect(307, "/articles/");
      break;
    case 'save':
      updateArticle(req.body.id, req, res);
      break;
    default:
      res.sendStatus(404);
  }
});

// POST
router.post("/", (req, res) => {
  (async () => {
    const metadata = await getMetadata();
    const topics = getTopicsByCodes(req.body.topics, metadata);
    const coordinators = req.body.coordinators && getOfficesByCodes(req.body.coordinators, metadata);
    const producingOffices = req.body.producing_office && getOfficesByCodes([req.body.producing_office], metadata);

    const article = new Article({
      coordinators: coordinators,
      date_published: req.body.date_published || dayjs.utc().format(),
      document_action: req.body.document_action,
      html_body: req.body.html_body,
      poc_info: req.body.poc_info,
      producing_offices: producingOffices,
      product_type_id: req.body.product_type_id,
      publication_number: req.body.publication_number,
      summary: req.body.summary,
      title: req.body.title,
      topics: topics,
      wire_id: req.body.wire_id,
    });

    article.save((error) => {
      if (error) {
        console.log(error);
      }
      (async () => {
        await indexService.create(article.indexable);
      })();
      res.send({ article: { id: article.id }, doc_num: article.doc_num });
    });
  })();
});

// Fetch single post
router.get("/:id/edit", (req, res) => {
  Article.findById(
    req.params.id,
    "attributes coordinators coauthors producing_offices doc_num title title_classification summary summary_classification date_published countries topics product_type_id html_body dissem_orgs images poc_info",
    function (error, article) {
      if (error) {
        console.error(error);
      }

      res.send(article.data.document);
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

function getOfficesByCodes(codes, metadata) {
  const offices = metadata.criteria.producing_offices;
  const result = [];

  for (const code of codes) {
    const office = offices.find((c) => c.code === code);
    if (office) {
      result.push(office);
    }
  }

  return result;
}

async function getMetadata() {
  return Metadata.findOne().lean();
}

// Update an article
router.put("/:id", (req, res) => {
  updateArticle(req.params.id, req, res);
});

// This method is extracted because of the legacy processDocument call and the fact that a POST is given but our new
// update endpoint is a put so I can't redirect. Once we update the UI to use the broken out endpoints, we can put the
// contents of this method back in the update endpoint.
async function updateArticle(id, req, res) {
  const metadata = await getMetadata();
  const countries = getCountriesByCodes(req.body.countries, metadata);
  const topics = getTopicsByCodes(req.body.topics, metadata);

  const article = {
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
    { _id: id },
    article,
    function (error, updatedArticle) {
      if (error) {
        console.error(error);
      }

      (async () => {

        await indexService.update(updatedArticle.indexable);
        res.send({
          success: true,
          article: updatedArticle,
          date: updatedArticle.date_published,
          doc_num: updatedArticle._id,
          id: updatedArticle._id,
          state: "draft",
        });
      })();
    }
  );
}

// Delete an article
router.delete("/:id", (req, res) => {
  Article.remove(
    {
      _id: req.params.id,
    },
    function (err) {
      if (err) res.send(err);
      res.send({
        success: true,
      });
    }
  );
});

module.exports = router;
