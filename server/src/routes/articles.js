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

const {KiwiStandardResponsesExpress, KiwiPreconditions} = require("@kiwiproject/kiwi-js");

const { ObjectStoreService } = require('../services/object-store-service');
const objectStoreService = new ObjectStoreService();
const ProductSearchService = require("../services/product-search-service");
const searchService = new ProductSearchService();
const WorkspaceService = require("../services/workspace");
const workspaceService = new WorkspaceService();

const upload = objectStoreService.buildUpload("attachments");
const { config } = require('../config/config');
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

  await runAsUser(req, res, async (currentUser, req, res) => {
    try {
      const articles = await productService.findAllByDate(req.params.date);
      const augmentedArticles = await Promise.all(articles.map(async article => {
        const baseData = article.forWire;
        await augmentProductWithSaved(baseData, currentUser.id, article.id);
        return baseData;
      }));
      res.json({features: augmentedArticles});
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

  await runAsUser(req, res, async (currentUser, req, res) => {
    try {
      const article = await productService.findByProductNumber(req.params.productNumber);
      const details = article.data.details;
      await augmentProductWithSaved(details, currentUser.id, article.id, false);
      res.json(details);
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
});

// POST (adapter to support /processDocument while working towards splitting it up)
router.post('/articles/processDocument', async (req, res) => {
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
        await publishProduct(req.body.id, req.user, req.body, req, res);
        break;
      case "save": {
        const productData = await buildUpdate(req.body.id, req.body, req.user);
        await updateProduct(req.body.id, productData, req, res);
        break;
      }
      default:
        res.sendStatus(404);
    }
  } catch (error) {
    logger.error(error);
    // res.json({
    //   error: `Unable to find article with product number ${req.params.productNumber}: ${error.message}`,
    // });
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
      updatedBy: {
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        dn: currentUser.dn,
      },
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


router.get('/articles/:id/view', async (req, res) => {
  /*
    #swagger.summary = 'Retrieve a product for viewing details'
    #swagger.tags = ['Products']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/ProductDetails'
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    try {
      const product = await productService.findById(req.params.id);
      const details = product.data.details;
      await augmentProductWithSaved(details, currentUser.id, product.id, false);
      res.json(details);
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
    const productData = await buildUpdate(req.params.id, req.body, req.user);
    await updateProduct(req.params.id, productData, req, res,);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

async function publishProduct(id, user, productContent, req, res) {
  const productData = await buildUpdate(id, productContent, user);
  productData.publishedBy = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    dn: user.dn,
  };
  productData.state = "posted";
  productData.datePublished = productContent.date_published || dayjs().format('YYYY-MM-DD');

  await updateProduct(id, productData, req, res);
}

// These two methods is extracted because of the legacy processDocument call and the fact that a POST is given but our new
// update endpoint is a put, so I can't redirect. Once we update the UI to use the broken out endpoints, we can put the
// contents of this method back in the update endpoint.
async function buildUpdate(id, productDataFromRequest, user) {
  const countries = await metadataService.findCountriesFor(
    productDataFromRequest.countries,
  );
  const subregions = await metadataService.findSubRegionsForCountries(
    productDataFromRequest.countries,
  );
  const regions = await metadataService.findRegionsForSubRegions(
    subregions.map((subregion) => subregion.code),
  );
  const topics = await metadataService.findTopicsFor(
    productDataFromRequest.topics,
  );
  const issues = await metadataService.findIssuesForTopics(
    productDataFromRequest.topics,
  );
  const producingOffices = await metadataService.findProducingOfficesFor(
    productDataFromRequest.producing_offices,
  );
  const coauthors = await metadataService.findCoauthorsFor(
    productDataFromRequest.coauthors,
  );
  const coordinators = await metadataService.findCoordinatorsFor(
    productDataFromRequest.coordinators,
  );
  const dissemOrgs = await metadataService.findDissemOrgsFor(
    productDataFromRequest.dissem_orgs,
  );
  const productType = await metadataService.findProductType(
    productDataFromRequest.product_type_id,
  );
  const reportingType = await metadataService.findReportingTypeFor(
    productDataFromRequest.product_type_id,
  );
  const nonStateActors = await metadataService.findNonStateActorsFor(
    productDataFromRequest.non_state_actors,
  );

  return {
    classification: productDataFromRequest.classification,
    classificationXml: productDataFromRequest.classification, // This will need to changed when we have real xml
    coauthors: coauthors.map(({ name, code }) => ({ name, code })),
    coordinators: coordinators.map(({ name, code }) => ({ name, code })),
    countries: countries.map(({ name, code }) => ({ name, code })),
    nonStateActors: nonStateActors.map(({ name, code }) => ({ name, code })),
    datePublished: dayjs(productDataFromRequest.date_published).format(
      "YYYY-MM-DD",
    ),
    dissemOrgs: dissemOrgs.map(({ name, code }) => ({ name, code })),
    htmlBody: productDataFromRequest.html_body,
    issues: issues,
    pocInfo: productDataFromRequest.poc_info,
    producingOffices: producingOffices.map(({ name, code }) => ({
      name,
      code,
    })),
    productNumber: productDataFromRequest.doc_num,
    productType: productType,
    publicationNumber: productDataFromRequest.publication_number,
    regions: regions.map(({ name, code }) => ({ name, code })),
    reportingType: reportingType,
    subregions: subregions.map(({ name, code }) => ({ name, code })),
    summary: productDataFromRequest.summary,
    summaryClassification: productDataFromRequest.summary_classif,
    summaryClassificationXml: productDataFromRequest.summary_classif, // This will need to changed when we have real xml
    title: productDataFromRequest.title,
    titleClassification: productDataFromRequest.title_classif,
    titleClassificationXml: productDataFromRequest.title_classif, // This will need to be changed when we have real xml
    topics: topics,
    thumbnailCaption: productDataFromRequest.thumbnailCaption,
    updatedAt: dayjs().toDate(),
    updatedBy: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      dn: user.dn,
    },
    worldwide: productDataFromRequest.worldwide,
  };
}

async function updateProduct(id, productData, req, res) {
  try {
    const updatedProduct = await productService.updateProduct(id, productData);

    res.json({
      success: true,
      article: updatedProduct.data.document,
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
    await workspaceService.deleteSavedProductForAllUsers(req.params.id);
    res.json({success: true});
  } catch (error) {
    console.log("Delete error", error);
    res.json({error: 'Unable to delete article'});
  }
});

router.post('/articles/:productNumber/attachments', upload.fields([{name: 'file'}, { name: 'upload' }]), async (req, res) => {
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
        url: '/api/documents/12345/attachments/67890',
        success: true,
      }
    }
   */

  try {
    const files = [];
    if (Array.isArray(req.files.file)) {
      files.push(...req.files.file);
    }
    if (Array.isArray(req.files.upload)) {
      files.push(...req.files.upload);
    }
    // logger.info("%o", req.files);
    KiwiPreconditions.checkArgument(files.length === 1);
    const fileUploadedObjectInfo = files[0];
    // logger.info("fileUploadedObjectInfo:%j", fileUploadedObjectInfo);
    const attachment = await productService.addAttachment(req.params.productNumber, fileUploadedObjectInfo);
    res.json({
      att_id: attachment._id,
      url: `${config.basePath}/documents/${req.params.productNumber}/attachments/${attachment.attachmentId}`,
      success: true,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({error: 'Unable to upload attachment'});
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
  try {
    const { metadata, stream } = await productService.getAttachment(req.params.productNumber, req.params.attachmentId);
    res.attachment(metadata.fileName);
    res.set('content-type', metadata.mimeType);
    stream.pipe(res);
  } catch (error) {
    logger.error(error);
    // KiwiStandardResponsesExpress.standardNotFoundResponse("Unable to find attachment", res);
    res.status(404).json({error: 'Unable to get attachment'});
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

async function augmentProductWithSaved(productData, currentUserId, productId, addToAttributes=true) {
  const isSaved = await workspaceService.isProductSaved(currentUserId, productId);
  productData.saved = isSaved;

  if (addToAttributes) {
    productData.attributes.saved = isSaved;
  }
}

module.exports = router;
