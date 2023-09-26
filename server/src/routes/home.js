const express = require("express");
const router = express.Router();

const ProductService = require("../services/product-service");
const productService = new ProductService();
const WorkspaceService = require("../services/workspace");
const workspaceService = new WorkspaceService();

const { runAsUser } = require("../util/request");

// GET home page features
router.get("/home/features", async (req, res) => {
  /*
    #swagger.summary = 'Retrieve a list of features and briefs for the home page'
    #swagger.tags = ['Products']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/FeaturesAndBriefs'
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    try {
      const featuresAndBriefs = await productService.findFeaturesAndBriefs();

      for (let product of featuresAndBriefs.featured) {
        await augmentProductWithSaved(
          product,
          currentUser.id,
          product.id.toString(),
        );
      }

      for (let product of featuresAndBriefs.briefs) {
        await augmentProductWithSaved(
          product,
          currentUser.id,
          product.id.toString(),
        );
      }

      res.json(featuresAndBriefs);
    } catch (error) {
      // TODO: Replace the following with kiwi-js#KiwiStandardResponses
      console.log("Unable to find features and briefs", error);
      res.json({ error: "Unable to find features and briefs" });
    }
  });
});

async function augmentProductWithSaved(productData, currentUserId, productId) {
  const isSaved = await workspaceService.isProductSaved(
    currentUserId,
    productId,
  );
  productData.saved = isSaved;
  productData.attributes.saved = isSaved;
}

module.exports = router;
