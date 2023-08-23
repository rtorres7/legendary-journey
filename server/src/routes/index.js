const express = require("express");
const router = express.Router();

const MetadataService = require('../services/metadata');
const metadataService = new MetadataService();

const { KiwiStandardResponsesExpress } = require("@kiwiproject/kiwi-js");
const { logger } = require("../config/logger");

router.get("/metadata", async (req, res) => {
  /*
    #swagger.tags = ['Metadata']
    #swagger.summary = 'Retrieve all the metadata'
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/Metadata'
      }
    }
   */

  try {
    const metadata = await metadataService.getAllMetadata();
    res.json({metadata});
  } catch (error) {
    logger.error(error);
    const errorDetails = `Unable to find metadata:  ${error.message}`;
    KiwiStandardResponsesExpress.standardErrorResponse(500, errorDetails, res);
  }
});

module.exports = router;
