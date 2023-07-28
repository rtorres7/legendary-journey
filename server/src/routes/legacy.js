const express = require("express");
const router = express.Router();
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const SpecialEditions = require("../models/special_editions");
const DissemOrgs = require("../models/dissem_orgs");

router.get(
  "/wires/:date_published/articles/:id/getDocumentData",
  (req, res) => {
    /*
      #swagger.tags = ['Legacy']
      #swagger.deprecated = true
      #swagger.summary = 'DEPRECATED: Retrieve a product for editing. Use GET /articles/{id}/edit'
     */

    res.redirect(`/articles/${req.params.id}/edit`);
  },
);

router.get("/wires/get_dissem_orgs", function (req, res) {
  /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Retrieves dissem orgs. Can be retrieved from metadata'
 */

  DissemOrgs.find({}, function (error, dissem_orgs) {
    res.send({ dissem_orgs });
  });
});

router.get("/preload/documents/:id.json", function (req, res) {
  /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Retrieve a product details . Use GET /articles/{id}'
 */

  res.redirect(`/articles/${req.params.id}`);
});

router.get("/documents/:id/preview.json", function (req, res) {
  /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Retrieve a product for preview. Use GET /articles/{id}'
 */

  res.redirect(`/articles/${req.params.id}`);
});

router.get("/documents/:docNum/related_documents.json", function (req,res) {
  /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Retrieve related documents. Use GET /relatedSearch/{productNumber}'
 */

  res.redirect("/relatedSearch/" +req.params.docNum);
});

router.get("/my_wire/user_data", function (req, res) {
  /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Retrieve current user info. Use GET /auth/profile'
 */

  res.redirect("/auth/profile");
});

router.get("/special_editions/links", async (req, res) => {
  /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Retrieve special editions.'
 */

  const specialEditions = await SpecialEditions.findOne({}).exec();
  res.json(specialEditions);
});

router.get("/documents/:doc_num", function (req, res) {
  /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Retrieve a product details. Use GET /articles/{id}'
 */

  res.redirect(`/articles/${req.params.doc_num}`);
});

router.get("/wires/:date_published/getWireByDate", function (req, res) {
  /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Retrieve products for a given date. Use GET /articles/date/{date}'
 */

  res.redirect(`/articles/date/${req.params.date_published}`);
});

router.put(
  "/wires/:date_published/articles/:id/visitorCount",
  function (req, res) {
    /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Updates the visitor count. NOT IMPLEMENTED!'
 */

    res.status(200).json({
      success: true,
    });
  },
);

router.get(
  "/documents/:doc_num/metrics/basic_metrics.json",
  function (req, res) {
    /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Retrieve metrics for a given document. NOT IMPLEMENTED!'
 */

    res.send({
      metrics: {
        readership: {},
        uniqueReadership: {},
      },
    });
  },
);

// TODO: This will go away once the UI changes to use DELETE /articles/:id
router.delete("/documents/:id/deleteMe", async (req, res) => {
  /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Deletes a product. Use DELETE /articles/{id}'
 */

  res.redirect(307, `/articles/${req.params.id}`);
});

router.post("/documents/:id/attachments", (req, res) => {
  /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Upload an attachment to the product. Use POST /articles/{id}/attachments'
 */
  res.redirect(307, `/articles/${req.params.id}/attachments`);
});

router.get("/documents/:id/attachments/:attachmentId", (req, res) => {
  /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Download an attachment attached to the product. Use GET /articles/{id}/attachments/{attachmentId}'
 */
  res.redirect(`/articles/${req.params.id}/attachments/${req.params.attachmentId}`);
});

router.delete("/documents/:id/attachments/:attachmentId", (req, res) => {
  /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Remove an attachment attached to the product. Use DELETE /articles/{id}/attachments/{attachmentId}'
 */
  res.redirect(`/articles/${req.params.id}/attachments/${req.params.attachmentId}`);
});

router.post("/documents/:id/thumbnails", (req, res) => {
  /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Upload an thumbnail to the product. Use POST /articles/{id}/thumbnails'
 */
  res.redirect(307, `/articles/${req.params.id}/thumbnails`);
});

router.get("/documents/:id/thumbnails/:thumbnailId", (req, res) => {
  /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Download an thumbnail attached to the product. Use GET /articles/{id}/thumbnails/{thumbnailId}'
 */
  res.redirect(`/articles/${req.params.id}/thumbnails/${req.params.thumbnailId}`);
});

router.delete("/documents/:id/thumbnails/:thumbnailId", (req, res) => {
  /*
  #swagger.tags = ['Legacy']
  #swagger.deprecated = true
  #swagger.summary = 'DEPRECATED: Remove an thumbnail attached to the product. Use DELETE /articles/{id}/thumbnails/{thumbnailId}'
 */
  res.redirect(`/articles/${req.params.id}/thumbnails/${req.params.thumbnailId}`);
});


module.exports = router;
