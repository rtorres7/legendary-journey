const express = require("express");
const router = express.Router();

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const { v4: uuidv4 } = require("uuid");

const Product = require("../models/products");

const { handleMongooseError } = require("../util/errors");

const ProductService = require("../services/product-service");
const productService = new ProductService();
const MetadataService = require("../services/metadata");
const metadataService = new MetadataService();

//GET products by date
router.get("/date/:date", async (req, res) => {
  try {
    const products = await productService.findAllByDate(req.params.date);
    res.json({ features: products.map((product) => product.forWire) });
  } catch (error) {
    // TODO: Replace the following with kiwi-js#KiwiStandardResponses
    handleMongooseError(
      `Unable to find products for date ${req.params.date}`,
      error
    );
    res.json({
      error: `Unable to find products for date ${req.params.date}: ${error.message}`,
    });
  }
});

//GET products by id
router.get("/:id", async (req, res) => {
  try {
    const product = await productService.findByProductNumber(req.params.id);
    res.json(product.data.details);
  } catch (error) {
    // TODO: Replace the following with kiwi-js#KiwiStandardResponses
    handleMongooseError(
      `Unable to find product with product number ${req.params.id}`,
      error
    );
    res.json({
      error: `Unable to find product with product number ${req.params.id}: ${error.message}`,
    });
  }
});

// POST (adapter to support /processDocument while working towards splitting it up)
router.post("/processDocument", (req, res) => {
  switch (req.body.document_action) {
    case "create":
      res.redirect(307, "/products/");
      break;
    case "save":
      updateProduct(req.body.id, req, res);
      break;
    case "publish":
      updateProduct(req.body.id, req, res);
      break;
    default:
      res.sendStatus(404);
  }
});

// POST
router.post("/", async (req, res) => {
  const topics = await metadataService.findTopicsFor(req.body.topics);
  const issues = await metadataService.findIssuesForTopics(topics);
  const producingOffices =
    req.body.producing_office &&
    (await metadataService.findProducingOfficesFor([
      req.body.producing_office,
    ]));
  const productType = await metadataService.findProductType(
    req.body.product_type_id
  );
  const reportingType = await metadataService.findReportingTypeFor(
    req.body.product_type_id
  );
  const nonStateActors = await metadataService.findNonStateActorsFor(
    req.body.non_state_actors
  );

  const product = new Product({
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
    const savedProduct = await productService.createProduct(product);
    res.json({
      product: { id: savedProduct.id },
      doc_num: savedProduct.productNumber,
    });
  } catch (error) {
    res.json({
      error: `There was a problem creating product: ${error.message}`,
    });
  }
});

// Fetch single post
router.get("/:id/edit", async (req, res) => {
  try {
    const product = await productService.findById(req.params.id);
    res.json(product.data.document);
  } catch (error) {
    handleMongooseError(
      `Unable to find product with id ${req.params.id}`,
      error
    );
    res.json({
      error: `Unable to find product with id ${req.params.id}: ${error.message}`,
    });
  }
});

router.get("/:id/view", async (req, res) => {
  try {
    const product = await productService.findById(req.params.id);
    res.json(product.data.details);
  } catch (error) {
    handleMongooseError(
      `Unable to find product with id ${req.params.id}`,
      error
    );
    res.json({
      error: `Unable to find product with id ${req.params.id}: ${error.message}`,
    });
  }
});

// Update an product
router.put("/:id", async (req, res) => {
  await updateProduct(req.params.id, req, res);
});

// This method is extracted because of the legacy processDocument call and the fact that a POST is given but our new
// update endpoint is a put, so I can't redirect. Once we update the UI to use the broken out endpoints, we can put the
// contents of this method back in the update endpoint.
async function updateProduct(id, req, res) {
  const countries = await metadataService.findCountriesFor(req.body.countries);
  const subregions = await metadataService.findSubRegionsForCountries(
    req.body.countries
  );
  const regions = await metadataService.findRegionsForSubRegions(
    subregions.map((subregion) => subregion.code)
  );
  const topics = await metadataService.findTopicsFor(req.body.topics);
  const issues = await metadataService.findIssuesForTopics(req.body.topics);
  const producingOffices = await metadataService.findProducingOfficesFor(
    req.body.producing_offices
  );
  const coauthors = await metadataService.findCoauthorsFor(req.body.coauthors);
  const coordinators = await metadataService.findCoordinatorsFor(
    req.body.coordinators
  );
  const dissemOrgs = await metadataService.findDissemOrgsFor(
    req.body.dissem_orgs
  );
  const productType = await metadataService.findProductType(
    req.body.product_type_id
  );
  const reportingType = await metadataService.findReportingTypeFor(
    req.body.product_type_id
  );
  const nonStateActors = await metadataService.findNonStateActorsFor(
    req.body.nonStateActors
  );

  const product = {
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
    const updatedProduct = await productService.updateProduct(id, product);
    res.json({
      success: true,
      product: updatedProduct,
      date: updatedProduct.datePublished,
      doc_num: updatedProduct.productNumber,
      id: updatedProduct._id,
      state: updatedProduct.state,
    });
  } catch (error) {
    res.json({
      error: `There was a problem updating product: ${error.message}`,
    });
  }
}
// Delete an product
router.delete("/:id", async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.json({ error: "Unable to delete product" });
  }
});

module.exports = router;