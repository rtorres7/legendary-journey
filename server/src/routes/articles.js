const express = require("express");
const router = express.Router();

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const { v4: uuidv4 } = require("uuid");

const Article = require("../models/articles");

const { handleMongooseError } = require("../util/errors");

const ProductService = require('../services/product-service');
const productService = new ProductService();
const MetadataService = require('../services/metadata');
const metadataService = new MetadataService();

//GET articles by date
router.get("/date/:date", async (req, res) => {
  try {
    const articles = await productService.findAllByDate(req.params.date);
    res.json({ features: articles.map(article => article.forWire) });
  } catch (error) {
    // TODO: Replace the following with kiwi-js#KiwiStandardResponses
    handleMongooseError(`Unable to find articles for date ${req.params.date}`, error);
    res.json({ error: `Unable to find articles for date ${req.params.date}: ${error.message}` });
  }
});

//GET articles by id
router.get("/:id", async (req, res) => {
  try {
    const article = await productService.findByProductNumber(req.params.id);
    res.json(article.data.details);
  } catch (error) {
    // TODO: Replace the following with kiwi-js#KiwiStandardResponses
    handleMongooseError(`Unable to find article with product number ${req.params.id}`, error);
    res.json({ error:  `Unable to find article with product number ${req.params.id}: ${error.message}`});
  }
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
router.post("/", async (req, res) => {
  const topics = await metadataService.findTopicsFor(req.body.topics);
  const issues = await metadataService.findIssuesForTopics(topics);
  const producingOffices = req.body.producing_office && await metadataService.findProducingOfficesFor([req.body.producing_office]);
  const productType = await metadataService.findProductType(req.body.product_type_id);
  const reportingType = await metadataService.findReportingTypeFor(req.body.product_type_id);
  const nonStateActors = await metadataService.findNonStateActorsFor(req.body.non_state_actors);

  const article = new Article({
    createdAt: dayjs().toDate(),
    datePublished: req.body.date_published || dayjs().format(),
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
    nonStateActors: nonStateActors,
    updatedAt: dayjs().toDate(),
  });

  try {
    const savedArticle = await productService.createProduct(article);
    res.json({ article: { id: savedArticle.id }, doc_num: savedArticle.productNumber });
  } catch (error) {
    res.json({ error: `There was a problem creating product: ${error.message}`});
  }
});

// Fetch single post
router.get("/:id/edit", async (req, res) => {
  try {
    const product = await productService.findById(req.params.id);
    res.json(product.data.document);
  } catch (error) {
    handleMongooseError(`Unable to find article with id ${req.params.id}`, error);
    res.json({ error:  `Unable to find article with id ${req.params.id}: ${error.message}`});
  }
});

router.get("/:id/view", async (req, res) => {
  try {
    const product = await productService.findById(req.params.id);
    res.json(product.data.details);
  } catch (error) {
    handleMongooseError(`Unable to find article with id ${req.params.id}`, error);
    res.json({ error:  `Unable to find article with id ${req.params.id}: ${error.message}`});
  }
});

// Update an article
router.put("/:id", async (req, res) => {
  await updateArticle(req.params.id, req, res);
});

// This method is extracted because of the legacy processDocument call and the fact that a POST is given but our new
// update endpoint is a put, so I can't redirect. Once we update the UI to use the broken out endpoints, we can put the
// contents of this method back in the update endpoint.
async function updateArticle(id, req, res) {
  const countries = await metadataService.findCountriesFor(req.body.countries);
  const subregions = await metadataService.findSubRegionsForCountries(req.body.countries);
  const regions = await metadataService.findRegionsForSubRegions(subregions.map(subregion => subregion.code));
  const topics = await metadataService.findTopicsFor(req.body.topics);
  const issues = await metadataService.findIssuesForTopics(req.body.topics);
  const producingOffices = await metadataService.findProducingOfficesFor(req.body.producing_offices);
  const coauthors = await metadataService.findCoauthorsFor(req.body.coauthors);
  const coordinators = await metadataService.findCoordinatorsFor(req.body.coordinators);
  const dissemOrgs = await metadataService.findDissemOrgsFor(req.body.dissem_orgs);
  const productType = await metadataService.findProductType(req.body.product_type_id);
  const reportingType = await metadataService.findReportingTypeFor(req.body.product_type_id);
  const nonStateActors = await metadataService.findNonStateActorsFor(req.body.nonStateActors);

  const article = {
    classification: req.body.classification,
    classificationXml: req.body.classification, // This will need to changed when we have real xml
    coauthors: coauthors,
    coordinators: coordinators,
    countries: countries,
    nonStateActors: nonStateActors,
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

  try {
    const updatedArticle = await productService.updateProduct(id, article);
    res.json({
      success: true,
      article: updatedArticle,
      date: updatedArticle.datePublished,
      doc_num: updatedArticle.productNumber,
      id: updatedArticle._id,
      state: updatedArticle.state,
    });
  } catch (error) {
    res.json({ error: `There was a problem updating product: ${error.message}`});
  }
}
// Delete an article
router.delete("/:id", async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.json({ error: 'Unable to delete article' });
  }
});

module.exports = router;
