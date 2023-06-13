const express = require("express");
const router = express.Router();

const MetadataService = require('../services/metadata');
const metadataService = new MetadataService();

const { handleMongooseError } = require("../util/errors");

router.get("/metadata", async (req, res) => {
  try {
    const metadata = await metadataService.getAllMetadata();
    res.json({ metadata });
  } catch (error) {
    // TODO: Replace the following with kiwi-js#KiwiStandardResponses
    handleMongooseError('Unable to find metadata', error);
    res.json({ error: 'Unable to find metadata' });
  }
});

module.exports = router;
