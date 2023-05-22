var express = require("express");
var router = express.Router();
const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

var Article = require("../models/articles");
var Metadata = require("../models/metadata");

const IndexService = require("../services");
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
    const topics = getLookupObjectsByCodes(req.body.topics, metadata.criteria.topics.values);
    const issues = getIssuesForTopics(req.body.topics, metadata.criteria.issues.values);
    const producingOffices = req.body.producing_office && getLookupObjectsByCodes([req.body.producing_office], metadata.criteria.producing_offices);
    const reportingType = getReportingTypeForProductType(req.body.product_type_id, metadata.criteria.reporting_types.values);
    const productTypeName = resolveProductType(req.body.product_type_id, metadata).name;

    const article = new Article({

      date_published: req.body.date_published || dayjs.utc().format(),
      document_action: req.body.document_action,
      html_body: req.body.html_body,
      issues: issues,
      needed: {},
      org_restricted: false,
      poc_info: req.body.poc_info,
      producing_offices: producingOffices,
      product_type_id: req.body.product_type_id,
      product_type: productTypeName,
      product_type_name: productTypeName,
      publication_number: req.body.publication_number,
      reporting_type: reportingType.code,
      reporting_type_display_name: reportingType.name,
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
  Article.findById(req.params.id, function (error, article) {
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

function getLookupObjectsByCodes(codes, metadata) {
  if (codes === undefined || metadata === undefined) {
    return [];
  }

  return metadata.filter(lookupData => codes.indexOf(lookupData.code) >= 0);
}

function resolveProductType(productTypeId, metadata) {
  const productTypes = metadata.criteria.product_types;
  return productTypes.values.filter(productType => {
    return productType.code === productTypeId;
  })[0];
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
  const countries = getLookupObjectsByCodes(req.body.countries, metadata.criteria.countries.values);
  const subRegions = getSubRegionsForCountries(req.body.countries, metadata.criteria.subregions.values);
  const regions = getRegionsForSubRegions(subRegions.map(subRegion => subRegion.code), metadata.criteria.regions.values);
  const topics = getLookupObjectsByCodes(req.body.topics, metadata.criteria.topics.values);
  const issues = getIssuesForTopics(req.body.topics, metadata.criteria.issues.values);
  const producing_offices = getLookupObjectsByCodes(req.body.producing_offices, metadata.criteria.producing_offices);
  const coauthors = getLookupObjectsByCodes(req.body.coauthors, metadata.criteria.coauthors);
  const coordinators = getLookupObjectsByCodes(req.body.coordinators, metadata.criteria.coordinators);
  const dissem_orgs = getLookupObjectsByCodes(req.body.dissem_orgs, metadata.criteria.dissem_orgs);
  const reportingType = getReportingTypeForProductType(req.body.product_type_id, metadata.criteria.reporting_types.values);
  const productTypeName = resolveProductType(req.body.product_type_id, metadata).name;

  const article = {
    ...req.body,
    topics: topics,
    issues: issues,
    countries: countries,
    regions: regions,
    region_names: regions.map(region => region.name),
    subregions: subRegions,
    producing_offices: producing_offices,
    coauthors: coauthors,
    coordinators: coordinators,
    dissem_orgs: dissem_orgs,
    date_published: dayjs.utc(req.body.date_published, "YYYY-MM-DD"),
    product_type: productTypeName,
    product_type_name: productTypeName,
    reporting_type: reportingType.code,
    reporting_type_display_name: reportingType.name,
  };

  Article.findByIdAndUpdate(
    { _id: id },
    article,
    { new: true },
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

function getSubRegionsForCountries(countryCodes, subRegions) {
  if (countryCodes === undefined || countryCodes.length === 0 || subRegions === undefined) {
    return [];
  }

  return subRegions.filter(subRegion => subRegion.country_codes.filter(code => countryCodes.includes(code)).length > 0);
}

function getRegionsForSubRegions(subRegionCodes, regions) {
  if (subRegionCodes === undefined || subRegionCodes.length === 0 || regions === undefined) {
    return [];
  }

  return regions.filter(region => region.subregions.filter(code => subRegionCodes.includes(code)).length > 0);
}

function getReportingTypeForProductType(productTypeId, reportingTypes) {
  if (productTypeId === undefined || reportingTypes === undefined) {
    return { name: '', code: ''};
  }

  const foundTypes = reportingTypes.filter(reportingType => reportingType.productTypes.includes(productTypeId));

  if (foundTypes.length === 0) {
    return { name: '', code: ''};
  }

  return foundTypes[0];
}

function getIssuesForTopics(topics, issues) {
  if (topics === undefined || topics.length === 0 || issues === undefined) {
    return [];
  }

  return issues.filter(issue => issue.topics.map(issue => issue.codes).flat().filter(code => topics.includes(code)).length > 0);
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
