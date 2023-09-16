const express = require("express");
const router = express.Router();
const { logger } = require("../config/logger");
const { KiwiStandardResponsesExpress } = require("@kiwiproject/kiwi-js");
const { runAsUser, pagingParams } = require("../util/request");
const Feed = require("../models/feed");
const FeedsService = require("../services/feeds-service");
const feedsService = new FeedsService();

router.get("/feeds", async (req, res) => {
  /*
    #swagger.summary = 'Retrieve all Feeds (SEs) that currently exist.'
    #swagger.tags = ['Feeds']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/Feed'
      }
    }
    #swagger.responses[500] = {
      schema: {
        $ref: '#/definition/StandardError'
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    try {
      let feeds = await feedsService.findAllFeeds();
      res.json(feeds);
    } catch (error) {
      KiwiStandardResponsesExpress.standardErrorResponse(
        500,
        `[findAllFeeds] Unable to find feeds: ${error.message}`,
        res,
      );
    }
  });
});

// {
//   "name": "Test Feed #1234",
//   "searchParams": "https://localhost:8443/search?text=test2",
//   "selectedReadings": ["WIReWIRe_sample_2", "WIReWIRe_sample_3"]
// }

router.get("/feeds/links", async (req, res) => {
  /*
    #swagger.summary = 'Get a list of links'
    #swagger.tags = ['Feeds']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/Feed'
      }
    }
    #swagger.responses[500] = {
      schema: {
        $ref: '#/definition/StandardError'
      }
    }
   */
  await runAsUser(req, res, async (currentUser, req, res) => {
    try {
      const feeds = await feedsService.findAllFeeds();
      res.json(feeds);
    } catch (error) {
      KiwiStandardResponsesExpress.standardErrorResponse(
        500,
        `[findAllFeeds2] Unable to find feeds: ${error.message}`,
        res,
      );
    }
  });
});

router.get("/feeds/:id", async (req, res) => {
  /*
    #swagger.summary = 'Retrieves a Feed by a given id'
    #swagger.tags = ['Feeds']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/Feed'
      }
    }
    #swagger.responses[500] = {
      schema: {
        $ref: '#/definition/StandardError'
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    const { perPage, page, skip, sortDir } = pagingParams(req);

    try {
      const feed = await feedsService.findFeedById(req.params.id);
      res.json(feed);
    } catch (error) {
      KiwiStandardResponsesExpress.standardErrorResponse(
        500,
        `[findFeedById] Unable to find feeds: ${error.message}`,
        res,
      );
    }
  });
});

router.post("/feeds/", async (req, res) => {
  /*
    #swagger.summary = 'Creates a Feed.'
    #swagger.tags = ['Feeds']
    #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/definitions/Feed" }
    }
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/Feed'
      }
    }
    #swagger.responses[500] = {
      schema: {
        $ref: '#/definition/StandardError'
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    const feed = {
      name: req.body.name,
      searchParams: req.body.searchParams,
      selectedReadings: req.body.selectedReadings.split("\n"),
      state: req.body.state,
      position: req.body.position,
      classification: req.body.name_classification,
    };
    try {
      const savedFeed = await feedsService.createFeed(feed);
      res.json(savedFeed);
    } catch (error) {
      logger.error(error);
      res.json({
        error: `There was a problem creating the feed: ${error.message}`,
      });
    }
  });
});

router.put("/feeds/:id", async (req, res) => {
  /*
    #swagger.summary = 'Updates a Feed.'
    #swagger.tags = ['Feeds']
    #swagger.requestBody = {
      schema: {
        $ref: '#/definitions/Feed'
      }
    }
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/Feed'
      }
    }
   */

  console.log("route successfully hit, payload: ", req.body);

  const updatedFeed = {
    name: req.body.name,
    searchParams: req.body.searchParams,
    selectedReadings: req.body.selectedReadings.split("\n"),
    state: req.body.state,
    position: req.body.position,
    classification: req.body.classification,
  };

  try {
    const savedFeed = await feedsService.updateFeed(req.params.id, updatedFeed);
    console.log(savedFeed);
    res.json(savedFeed);
  } catch (error) {
    logger.error(error);
    res.json({
      error: `There was a problem updating the feed: ${error.message}`,
    });
  }
});

router.delete("/feeds/:id", async (req, res) => {
  /*
    #swagger.summary = 'Deletes a Feed.'
    #swagger.tags = ['Feeds']
    #swagger.responses[204] = {
      schema: {
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    await feedsService.deleteFeed(req.params.id, 1);
    res.status(204).send();
  });
});

module.exports = router;
