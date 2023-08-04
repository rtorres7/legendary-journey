const express = require("express");
const router = express.Router();
const path = require('path');

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const { v4: uuidv4 } = require("uuid");

const Article = require("../models/articles");

const { handleMongooseError } = require("../util/errors");

const { runAsUser } = require("../util/request");

const ProductService = require("../services/product-service");
const productService = new ProductService();
const MetadataService = require("../services/metadata");
const metadataService = new MetadataService();

const {KiwiStandardResponsesExpress} = require('@kiwiproject/kiwi-js');

const { ObjectStoreService } = require('../services/object-store-service');
const objectStoreService = new ObjectStoreService();
const ProductSearchService = require("../services/product-search-service");
const searchService = new ProductSearchService();

const upload = objectStoreService.buildUpload("foo", "bar");
const { logger } = require('../config/logger');

const _ = require('lodash');

//GET articles by date
router.get('/articles/date/:date', async (req, res) => {
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
    const articles = await productService.findAllByDate(req.params.date);
    res.json({ features: articles.map((article) => article.forWire) });
  } catch (error) {
    // TODO: Replace the following with kiwi-js#KiwiStandardResponses
    handleMongooseError(
      `Unable to find articles for date ${req.params.date}`,
      error
    );
    res.json({
      error: `Unable to find articles for date ${req.params.date}: ${error.message}`,
    });
  }
});

//GET articles by id
router.get('/articles/:productNumber', async (req, res) => {
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
    const article = await productService.findByProductNumber(req.params.productNumber);
    res.json(article.data.details);
  } catch (error) {
    // TODO: Replace the following with kiwi-js#KiwiStandardResponses
    handleMongooseError(
      `Unable to find article with product number ${req.params.productNumber}`,
      error,
    );
    res.json({
      error: `Unable to find article with product number ${req.params.productNumber}: ${error.message}`,
    });
  }
});

// POST (adapter to support /processDocument while working towards splitting it up)
router.post('/articles/processDocument', async (req, res, next) => {
  /*
    #swagger.tags = ['Products']
    #swagger.deprecated = true
    #swagger.summary = 'DEPRECATED: Single endpoint that supports create, publish, and save/update actions. Use dedicated endpoints to accomplish the same calls.'
    #swagger.responses[200] = {
      description: 'Updates a given product. Same action as PUT /articles/{id}'
    }
    #swagger.responses[307] = {
      description: 'Redirects the create action to POST /articles'
    }
   */

  try {
    switch (req.body.document_action) {
      case 'create':
        res.redirect(307, '/articles/');
        break;
      case "publish":
        req.body.state = "posted";
        await updateArticle(req.body.id, req, res, next);
        break;
      case "save":
        await updateArticle(req.body.id, req, res, next);
        break;
      default:
        res.sendStatus(404);
    }
  } catch (err) {
    logger.error(`POST /articles/processDocument:`, err);
    next(err);
  }
});

// POST
router.post('/articles/', async (req, res) => {
  /*
    #swagger.summary = 'Create a new product'
    #swagger.tags = ['Products']
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/definitions/NewProduct" }
    }
    #swagger.responses[200] = {
      schema: {
        article: {
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

    const article = new Article({
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
      const savedArticle = await productService.createProduct(article);
      res.json({ article: { id: savedArticle.id }, doc_num: savedArticle.productNumber });
    } catch (error) {
      res.json({ error: `There was a problem creating product: ${error.message}` });
    }
  });
});

// Fetch single post
router.get('/articles/:id/edit', async (req, res) => {
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
      `Unable to find article with id ${req.params.id}`,
      error
    );
    res.json({
      error: `Unable to find article with id ${req.params.id}: ${error.message}`,
    });
  }
});


router.get('/articles/:id/view', async (req, res, next) => {
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
      `Unable to find article with id ${req.params.id}`,
      error
    );
    res.json({
      error: `Unable to find article with id ${req.params.id}: ${error.message}`,
    });
  }
});

// Update an article
router.put('/articles/:id', async (req, res, next) => {
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
        article: {
          $ref: '#/definitions/ProductDocument'
        },
        date: '2023-01-01',
        doc_num: '',
        id: '',
        state: ''
      }
    }
   */
  try {
    await updateArticle(req.params.id, req, res, next);
  } catch (err) {
    logger.error(`PUT /articles/${req.params.id}:`, err);
    next(err);
  }
});

// This method is extracted because of the legacy processDocument call and the fact that a POST is given but our new
// update endpoint is a put, so I can't redirect. Once we update the UI to use the broken out endpoints, we can put the
// contents of this method back in the update endpoint.
async function updateArticle(id, req, res, next) {
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
  if (!coauthors) {
    throw new Error('coauthors not found');
  }
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
  const article = {
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
    const updatedArticle = await productService.updateProduct(id, article);
    res.json({
      success: true,
      article: updatedArticle.data.document,
      date: dayjs(updatedArticle.datePublished).format('YYYY-MM-DD'),
      doc_num: updatedArticle.productNumber,
      id: updatedArticle._id,
      state: updatedArticle.state,
    });
  } catch (error) {
    res.json({
      error: `There was a problem updating product: ${error.message}`,
    });
    throw error;
  }
}
// Delete an article
router.delete('/articles/:id', async (req, res) => {
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
    res.json({error: 'Unable to delete article'});
  }
});

router.post('/articles/:productNumber/attachments', upload.single('file'), async (req, res, next) => {
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
  
  try {
    const id = uuidv4();
    const parsed = path.parse(req.file.originalname);
    const isThumbnail = parsed.name === 'article' && parsed.ext.match(/^\.(jpg|jpeg|png|gif|webp)$/i);
    const isVisible = req.params.is_visible ? req.params.is_visible !== 'false' : !isThumbnail;
  
    const attachment = {
      attachmentId: id,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      createdAt: new Date(),
      fileSize: req.file.size,
      type: 'ATTACHMENT',
      destination: `${req.file.storage}://${req.file.bucket}/${req.file.path}`,
      visible: isVisible,
    };
    
    
    await productService.addAttachment(req.params.productNumber, attachment);
    // logger.info(`POST /articles/${req.params.productNumber}/attachments:  attachmentId:${id}, is_visible:${req.params.is_visible}`);
    // logger.info("%O", attachment);

    res.json({att_id: id, success: true});
  } catch (err) {
    logger.error(`POST /articles/${req.params.productNumber}/attachments:`, err);
    next(err);
  }
});

router.get('/articles/:productNumber/attachments/:attachmentId', async (req, res) => {
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
  // logger.info(`GET /articles/${req.params.productNumber}/attachments/${req.params.attachmentId}`);

  const product = await productService.findByProductNumber(req.params.productNumber);

  let attachments;
  if (req.params.attachmentId === 'article') {
    const last = product.attachmentsMetadata.reduce((acc, value) => {
      if (value.usage === 'article') {
        if (acc == null) {
          return value;
        }
        if (dayjs(acc.updated_at).isBefore(dayjs(value.updated_at))) {
          return value;
        }
        return acc;
      }
    });
    attachments = last != null ? [last] : [];
  } else {
    attachments = product.attachmentsMetadata.filter(att =>
      att.id === req.params.attachmentId ||
      att.attachmentId === req.params.attachmentId ||
      att.fileName === req.params.attachmentId);
  }

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

router.delete('/articles/:productNumber/attachments/:attachmentId', async (req, res) => {
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
