const express = require("express");
const router = express.Router();
const { logger } = require("../config/logger");
const { KiwiStandardResponsesExpress } = require("@kiwiproject/kiwi-js");
const { runAsUser, pagingParams } = require("../util/request");
const Feed = require("../models/feed");
const FeedsService = require("../services/feeds-service");
const feedsService = new FeedsService();
const ProductSearchService = require("../services/product-search-service");
const searchService = new ProductSearchService(process.env.ES_URL);

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

      const nullToUndefined = (val) => (val === null ? undefined : val);

      const url = new URL(feed.searchParams);
      const perPage = nullToUndefined(url.searchParams.get("per_page"));
      const page = nullToUndefined(url.searchParams.get("page"));
      const sortDir = nullToUndefined(url.searchParams.get("sort_dir"));
      const searchParams = new URLSearchParams(url.search);
      const searchText = nullToUndefined(searchParams.get("text"));

      const queryObject = {};
      url.searchParams.forEach((value, key) => {
        queryObject[key] = nullToUndefined(value);
      });

      const searchResults = await searchService.search(
        searchText,
        perPage,
        page,
        sortDir,
        queryObject,
      );

      if (searchResults && searchResults.results) {
        feed.setDataValue("articles", searchResults.results);
      }

      feed.setDataValue("readings", [
        {
          id: "WIReWIRe_sample_2",
          name: "WIReWIRe_sample_2",
          title: "WIReWIRe_sample_2",
          doc_num: "WIReWIRe_sample_2",
          name_classification: "UNCLASSIFIED",
          title_classification: "UNCLASSIFIED",
        },
        {
          id: "WIReWIRe_sample_5",
          name: "WIReWIRe_sample_5",
          title: "WIReWIRe_sample_5",
          doc_num: "WIReWIRe_sample_5",
          name_classification: "UNCLASSIFIED",
          title_classification: "UNCLASSIFIED",
        },
      ]);

      feed.setDataValue(
        "selectedReadings",
        '{"WIReWIRe_sample_3","WIReWIRe_sample_5"}',
      );

      // const arrayFromString = feed.selectedReadings.slice(1, -1).split(",");
      // const newlineDelimitedString = arrayFromString.join("\n");
      // feed.setDataValue("selectedReadings", newlineDelimitedString);

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
      classification: req.body.classification,
      classificationXml: req.body.classificationXml,
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
    classificationXml: req.body.classificationXml,
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
