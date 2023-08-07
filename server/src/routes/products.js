const express = require("express");
const router = express.Router();

const _ = require("lodash");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const { v4: uuidv4 } = require("uuid");

const Product = require("../models/products");

const { handleMongooseError } = require("../util/errors");

const { runAsUser } = require("../util/request");

const ProductService = require("../services/product-service");
const productService = new ProductService();
const MetadataService = require("../services/metadata");
const metadataService = new MetadataService();
const { ObjectStoreService } = require('../services/object-store-service');
const objectStoreService = new ObjectStoreService();
const ProductSearchService = require("../services/product-search-service");
const searchService = new ProductSearchService();

const multer = require('multer');
const ObjectStorageEngine = require('../util/object-storage-engine');
const {KiwiStandardResponsesExpress} = require('@kiwiproject/kiwi-js');
const engine = new ObjectStorageEngine({ bucket: 'foo', prefix: 'bar'}); // TODO: This needs to be updated
const upload = multer({ storage: engine });

//GET products by date
router.get('/products/date/:date', async (req, res) => {
  /*
    #swagger.summary = 'Get a list of products for a given date'
    #swagger.tags = ['Products']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/Features'
      }
    }
   */

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
router.get('/products/:productNumber', async (req, res) => {
  /*
    #swagger.summary = 'Retrieve a product with a given product number'
    #swagger.tags = ['Products']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/ProductDetails'
      }
    }
   */

  try {
    const product = await productService.findByProductNumber(req.params.productNumber);
    res.json(product.data.details);
  } catch (error) {
    // TODO: Replace the following with kiwi-js#KiwiStandardResponses
    handleMongooseError(
      `Unable to find product with product number ${req.params.productNumber}`,
      error,
    );
    res.json({
      error: `Unable to find product with product number ${req.params.productNumber}: ${error.message}`,
    });
  }
});

// POST (adapter to support /processDocument while working towards splitting it up)
router.post('/products/processDocument', (req, res) => {
  /*
    #swagger.tags = ['Products']
    #swagger.deprecated = true
    #swagger.summary = 'DEPRECATED: Single endpoint that supports create, publish, and save/update actions. Use dedicated endpoints to accomplish the same calls.'
    #swagger.responses[200] = {
      description: 'Updates a given product. Same action as PUT /products/{id}'
    }
    #swagger.responses[307] = {
      description: 'Redirects the create action to POST /products'
    }
   */
  console.log("HERE1", req.body)
  switch (req.body.document_action) {
    case 'create':
      res.redirect(307, '/products/');
      break;
    case "publish":
      req.body.state = "posted";
      updateProduct(req.body.id, req, res);
      break;
    case "save":
      updateProduct(req.body.id, req, res);
      break;
    default:
      res.sendStatus(404);
  }
});

// POST
router.post('/products/', async (req, res) => {
  /*
    #swagger.summary = 'Create a new product'
    #swagger.tags = ['Products']
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/definitions/NewProduct" }
    }
    #swagger.responses[200] = {
      schema: {
        product: {
          id: ''
        },
        doc_num: ''
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    const topics = await metadataService.findTopicsFor(req.body.topics);
    const issues = await metadataService.findIssuesForTopics(topics);
    const producingOffices = req.body.producing_office && (await metadataService.findProducingOfficesFor([req.body.producing_office]));
    const productType = await metadataService.findProductType(req.body.product_type_id);
    const reportingType = await metadataService.findReportingTypeFor(req.body.product_type_id);
    const nonStateActors = await metadataService.findNonStateActorsFor(req.body.non_state_actors);

    const product = new Product({
      createdAt: dayjs().toDate(),
      createdBy: {
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        dn: currentUser.dn,
      },
      datePublished: req.body.date_published || dayjs().format('YYYY-MM-DD'),
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
      res.json({ product: { id: savedProduct.id }, doc_num: savedProduct.productNumber, article: { id: savedProduct.id }, doc_num: savedProduct.productNumber });
    } catch (error) {
      res.json({ error: `There was a problem creating product: ${error.message}` });
    }
  });
});

// Fetch single post
router.get('/products/:id/edit', async (req, res) => {
  /*
    #swagger.summary = 'Retrieve a product for editing'
    #swagger.tags = ['Products']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/ProductDocument'
      }
    }
   */

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


router.get('/products/:id/view', async (req, res) => {
  /*
    #swagger.summary = 'Retrieve a product for viewing details'
    #swagger.tags = ['Products']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/ProductDetails'
      }
    }
   */

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
router.put('/products/:id', async (req, res) => {
  /*
    #swagger.summary = 'Update a product'
    #swagger.tags = ['Products']
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/definitions/UpdateProduct" }
    }
    #swagger.responses[200] = {
      schema: {
        success: true,
        product: {
          $ref: '#/definitions/ProductDocument'
        },
        date: '2023-01-01',
        doc_num: '',
        id: '',
        state: ''
      }
    }
   */

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
    req.body.non_state_actors
  );

  const product = {
    classification: req.body.classification,
    classificationXml: req.body.classification, // This will need to changed when we have real xml
    coauthors: coauthors.map(({name, code}) => ({name, code})),
    coordinators: coordinators.map(({name, code}) => ({name, code})),
    countries: countries.map(({name, code}) => ({name, code})),
    nonStateActors: nonStateActors.map(({name, code}) => ({name, code})),
    datePublished: dayjs(req.body.date_published).format('YYYY-MM-DD'),
    dissemOrgs: dissemOrgs.map(({name, code}) => ({name, code})),
    htmlBody: req.body.html_body,
    issues: issues,
    pocInfo: req.body.poc_info,
    producingOffices: producingOffices.map(({name, code}) => ({name, code})),
    productNumber: req.body.doc_num,
    productType: productType,
    publicationNumber: req.body.publication_number,
    regions: regions.map(({name, code}) => ({name, code})),
    reportingType: reportingType,
    state: req.body.state,
    subregions: subregions.map(({name, code}) => ({name, code})),
    summary: req.body.summary,
    summaryClassification: req.body.summary_classif,
    summaryClassificationXml: req.body.summary_classif, // This will need to changed when we have real xml
    title: req.body.title,
    titleClassification: req.body.title_classif,
    titleClassificationXml: req.body.title_classif, // This will need to be changed when we have real xml
    topics: topics,
    thumbnailCaption: req.body.thumbnailCaption,
    updatedAt: dayjs().toDate(),
    updatedBy: {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      dn: req.user.dn,
    },
    worldwide: req.body.worldwide,
  };

  try {
    const updatedProduct = await productService.updateProduct(id, product);
    res.json({
      success: true,
      product: updatedProduct.data.document,
      date: dayjs(updatedProduct.datePublished).format('YYYY-MM-DD'),
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
router.delete('/products/:id', async (req, res) => {
  /*
    #swagger.summary = 'Delete a given product'
    #swagger.tags = ['Products']
    #swagger.responses[200] = {
      schema: {
        success: true
      }
    }
   */

  try {
    await productService.deleteProduct(req.params.id);
    res.json({success: true});
  } catch (error) {
    res.json({error: 'Unable to delete product'});
  }
});

router.post('/products/:productNumber/attachments', upload.single('file'), async (req, res) => {
  /*
    #swagger.summary = 'Upload an attachment for the given product'
    #swagger.tags = ['Products']
    #swagger.requestBody = {
      content: {
        'multipart/form-data': {}
      }
    }
    #swagger.responses[200] = {
      schema: {
        att_id: 'abc',
        success: true,
      }
    }
   */

  const id = uuidv4();
  const attachment = {
    attachmentId: id,
    fileName: req.file.originalname,
    mimeType: req.file.mimetype,
    createdAt: new Date(),
    fileSize: req.file.size,
    type: 'ATTACHMENT',
    destination: `${req.file.storage}://${req.file.bucket}/${req.file.path}`,
    visible: true
  };

  await productService.addAttachment(req.params.productNumber, attachment);

  res.json({att_id: id, success: true});
});

router.get('/products/:productNumber/attachments/:attachmentId', async (req, res) => {
  /*
    #swagger.summary = 'Download a given attachment for the given product'
    #swagger.tags = ['Products']
    #swagger.responses[200] = {
      content: {
        'application/pdf': {}
      }
    }
    #swagger.responses[404] = {
      schema: {
        $ref: '#/definitions/StandardError'
      }
    }
   */

  const product = await productService.findByProductNumber(req.params.productNumber);

  const attachments = product.attachmentsMetadata.filter(att =>
    att.id === req.params.attachmentId ||
    att.attachmentId === req.params.attachmentId ||
    att.fileName === req.params.attachmentId
  );

  if (attachments.length === 0) {
    KiwiStandardResponsesExpress.standardNotFoundResponse("Unable to find attachment", res);
  } else {
    const attachment = attachments[0];
    res.attachment(attachment.fileName);

    const [, path] = attachment.destination.split("//");
    const bucketSeparatorIndex = path.indexOf("/");
    const bucket = path.substring(0, bucketSeparatorIndex);
    const objectName = path.substring(bucketSeparatorIndex);

    const fileStream = await objectStoreService.getObject(bucket, objectName);

    fileStream.pipe(res);
  }
});

router.delete('/products/:productNumber/attachments/:attachmentId', async (req, res) => {
  /*
    #swagger.summary = 'Remove a given attachment for the given product'
    #swagger.tags = ['Products']
    #swagger.responses[200] = {
      schema: {
        success: true
      }
    }
   */

  const product = await productService.findByProductNumber(req.params.productNumber);

  const removedAttachments = _.remove(product.attachmentsMetadata, (att => att.id === req.params.attachmentId || att.attachmentId === req.params.attachmentId));
  product.markModified('attachmentsMetadata');
  await product.save();

  for (const att of removedAttachments) {
    const [, path] = att.destination.split("//");
    const bucketSeparatorIndex = path.indexOf("/");
    const bucket = path.substring(0, bucketSeparatorIndex);
    const objectName = path.substring(bucketSeparatorIndex);

    await objectStoreService.removeObject(bucket, objectName);

    await searchService.removeIndexedAttachment(product.id, att.attachmentId);
  }

  res.json({ success: true });
});

module.exports = router;