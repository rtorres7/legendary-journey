const express = require("express");
const router = express.Router();
const { KiwiStandardResponsesExpress } = require("@kiwiproject/kiwi-js");
const { runAsUser, pagingParams } = require("../util/request");
const FeedsService = require("../services/feeds-service");
const feedsService = new FeedsService();

router.get("/special_editions", async (req, res) => {
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
      const feeds = await feedsService.findAllFeeds();
      res.json(feeds);
    } catch (error) {
      KiwiStandardResponsesExpress.standardErrorResponse(
        500,
        `Unable to find feeds: ${error.message}`,
        res,
      );
    }
  });
});

router.get("/special_editions/:id", async (req, res) => {
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
        `Unable to find feeds: ${error.message}`,
        res,
      );
    }
  });
});

router.post("/special_editions/", async (req, res) => {
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
    const feed = new Feed({
      name: req.body.name,
      searchParams: req.body.searchParams,
      selectedReadings: req.body.selectedReadings,
      state: req.body.state,
      order: req.body.order,
      classification: req.body.classification,
    });
    console.log("still in the router");
    try {
      const savedFeed = await feedsService.createFeed(feed);
      res.json({
        feed: { id: savedFeed.id },
      });
    } catch (error) {
      res.json({
        error: `There was a problem creating the feed: ${error.message}`,
      });
    }
  });
});

router.put("/special_editions/:id", async (req, res) => {
  /*
    #swagger.summary = 'Updates a Feed.'
    #swagger.tags = ['Feed']
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

  const updatedFeed = await feedsService.updateFeed(req.params.id, {
    name: req.body.name,
    searchParams: req.body.searchParams,
    selectedReadings: req.body.selectedReadings,
    state: req.body.state,
    order: req.body.order,
    classification: req.body.classification,
  });

  res.json(updatedFeed);
});

router.delete("/special_editions/:id", async (req, res) => {
  /*
    #swagger.summary = 'Deletes a Feed.'
    #swagger.tags = ['Feed']
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
