const express = require("express");
const router = express.Router();
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const { v4: uuidv4 } = require("uuid");

const Article = require("../models/articles");
const Metadata = require("../models/metadata");

const IndexService = require("../services");
const { handleMongooseError } = require("../util/errors");
const indexService = new IndexService(process.env.ES_URL);

// TODO: Not sure this endpoint is being used and if it is, the response data format needs to change
// GET
router.get("/", (req, res) => {
  Article.find(
    {},
    "attributes doc_num title title_classification summary summary_classification date_published state",
    function (error, articles) {
      handleMongooseError("Unable to load articles", error);

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
  const start = dayjs(req.params.date).startOf("day").toDate();
  const end = dayjs(req.params.date).endOf("day").toDate();

  Article.find(
    { datePublished: { $gte: start, $lte: end } },
    function (error, article) {
      handleMongooseError("Unable to find articles", error);

      const articlesForWire = article.map((article) => article.forWire);
      res.json({ features: articlesForWire });
    }
  );
});

//GET articles by id
router.get("/:id", (req, res) => {
  Article.findOne({ productNumber: req.params.id }, (errors, article) => {
    handleMongooseError("Unable to find article", errors);
    res.json(article.data.details);
  });
});

// POST (adapter to support /processDocument while working towards splitting it up)
router.post("/processDocument", (req, res) => {
  switch (req.body.document_action) {
    case "create":
      res.redirect(307, "/articles/");
      break;
    case "save":
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
    const topics = getLookupObjectsByCodes(
      req.body.topics,
      metadata.criteria.topics.values
    );
    const issues = getIssuesForTopics(
      req.body.topics,
      metadata.criteria.issues.values
    );
    const producingOffices =
      req.body.producing_office &&
      getLookupObjectsByCodes(
        [req.body.producing_office],
        metadata.criteria.producing_offices
      );
    const reportingType = getReportingTypeForProductType(
      req.body.product_type_id,
      metadata.criteria.reporting_types.values
    );
    const productType = resolveProductType(req.body.product_type_id, metadata);

    const article = new Article({
      createdAt: dayjs().toDate(),
      datePublished: req.body.date_published || dayjs.utc().format(),
      htmlBody: req.body.html_body,
      issues: issues,
      needed: {},
      orgRestricted: false,
      productNumber: uuidv4(),
      producingOffices: producingOffices,
      productType: productType,
      publicationNumber: req.body.publication_number,
      reportingType: reportingType,
      summary: req.body.summary,
      title: req.body.title,
      topics: topics,
      updatedAt: dayjs().toDate(),
    });

    article.save((error) => {
      handleMongooseError("Unable to save article", error);

      (async () => {
        await indexService.create(article.indexable);
      })();
      res.json({ article: { id: article.id }, doc_num: article.productNumber });
    });
  })();
});

// Fetch single post
router.get("/:id/edit", (req, res) => {
  Article.findById(req.params.id, function (error, article) {
    handleMongooseError("Unable to load article for edit", error);

    res.json(article.data.document);
  });
});

router.get("/:id/view", function (req, res) {
  Article.findById(req.params.id, function (error, article) {
    handleMongooseError(
      `Unable to find article with id ${req.params.id}`,
      error
    );
    res.json(article.data.details);
  });
});

function getLookupObjectsByCodes(codes, metadata) {
  if (codes === undefined || metadata === undefined) {
    return [];
  }

  return metadata.filter((lookupData) => codes.indexOf(lookupData.code) >= 0);
}

function resolveProductType(productTypeId, metadata) {
  const productTypes = metadata.criteria.product_types;
  return productTypes.values.filter((productType) => {
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
// update endpoint is a put, so I can't redirect. Once we update the UI to use the broken out endpoints, we can put the
// contents of this method back in the update endpoint.
async function updateArticle(id, req, res) {
  const metadata = await getMetadata();

  const countries = getLookupObjectsByCodes(
    req.body.countries,
    metadata.criteria.countries.values
  );
  const subregions = getSubRegionsForCountries(
    req.body.countries,
    metadata.criteria.subregions.values
  );
  const regions = getRegionsForSubRegions(
    subregions.map((subRegion) => subRegion.code),
    metadata.criteria.regions.values
  );

  const topics = getLookupObjectsByCodes(
    req.body.topics,
    metadata.criteria.topics.values
  );
  const issues = getIssuesForTopics(
    req.body.topics,
    metadata.criteria.issues.values
  );

  const producingOffices = getLookupObjectsByCodes(
    req.body.producing_offices,
    metadata.criteria.producing_offices
  );
  const coauthors = getLookupObjectsByCodes(
    req.body.coauthors,
    metadata.criteria.coauthors
  );
  const coordinators = getLookupObjectsByCodes(
    req.body.coordinators,
    metadata.criteria.coordinators
  );
  const dissemOrgs = getLookupObjectsByCodes(
    req.body.dissem_orgs,
    metadata.criteria.dissem_orgs
  );
  const reportingType = getReportingTypeForProductType(
    req.body.product_type_id,
    metadata.criteria.reporting_types.values
  );
  const productType = resolveProductType(req.body.product_type_id, metadata);

  const article = {
    classification: req.body.classification,
    classificationXml: req.body.classification, // This will need to changed when we have real xml
    coauthors: coauthors,
    coordinators: coordinators,
    countries: countries,
    datePublished: req.body.date_published,
    dissemOrgs: dissemOrgs,
    htmlBody: req.body.html_body,
    issues: issues,
    pocInfo: req.body.poc_info,
    producingOffices: producingOffices,
    productNumber: req.body.doc_num,
    productType: productType,
    publicationNumber: req.body.publication_number,
    regions: regions,
    reportingType: reportingType,
    subregions: subregions,
    summary: req.body.summary,
    summaryClassification: req.body.summary_classif,
    summaryClassificationXml: req.body.summary_classif, // This will need to changed when we have real xml
    title: req.body.title,
    titleClassification: req.body.title_classif,
    titleClassificationXml: req.body.title_classif, // This will need to be changed when we have real xml
    topics: topics,
    thumbnailCaption: req.body.thumbnailCaption,
    updatedAt: dayjs().toDate(),
    worldwide: req.body.worldwide,
  };

  Article.findByIdAndUpdate(
    { _id: id },
    article,
    { new: true },
    function (error, updatedArticle) {
      handleMongooseError(`Unable to update article with id ${id}`, error);

      (async () => {
        await indexService.update(updatedArticle.indexable);
        res.json({
          success: true,
          article: updatedArticle,
          date: updatedArticle.datePublished,
          doc_num: updatedArticle.productNumber,
          id: updatedArticle._id,
          state: updatedArticle.state,
        });
      })();
    }
  );
}

function getSubRegionsForCountries(countryCodes, subRegions) {
  if (
    countryCodes === undefined ||
    countryCodes.length === 0 ||
    subRegions === undefined
  ) {
    return [];
  }

  return subRegions.filter(
    (subRegion) =>
      subRegion.country_codes.filter((code) => countryCodes.includes(code))
        .length > 0
  );
}

function getRegionsForSubRegions(subRegionCodes, regions) {
  if (
    subRegionCodes === undefined ||
    subRegionCodes.length === 0 ||
    regions === undefined
  ) {
    return [];
  }

  return regions.filter(
    (region) =>
      region.subregions.filter((code) => subRegionCodes.includes(code)).length >
      0
  );
}

function getReportingTypeForProductType(productTypeId, reportingTypes) {
  if (productTypeId === undefined || reportingTypes === undefined) {
    return { name: "", code: "" };
  }

  const foundTypes = reportingTypes.filter((reportingType) =>
    reportingType.productTypes.includes(productTypeId)
  );

  if (foundTypes.length === 0) {
    return { name: "", code: "" };
  }

  return foundTypes[0];
}

function getIssuesForTopics(topics, issues) {
  if (topics === undefined || topics.length === 0 || issues === undefined) {
    return [];
  }

  return issues.filter(
    (issue) =>
      issue.topics
        .map((issue) => issue.codes)
        .flat()
        .filter((code) => topics.includes(code)).length > 0
  );
}

// Delete an article
router.delete("/:id", (req, res) => {
  Article.remove(
    {
      _id: req.params.id,
    },
    function (err) {
      handleMongooseError("Unable to delete article", err);

      res.json({
        success: true,
      });
    }
  );
});

module.exports = router;
