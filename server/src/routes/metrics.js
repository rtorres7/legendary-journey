import { read } from "fs";

const express = require("express");
const router = express.Router();

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const { runAsUser } = require("../util/request");

const { KiwiStandardResponsesExpress } = require("@kiwiproject/kiwi-js");

const AggregatedMetricsService = require("../services/aggregated-metrics-service");
const metricsService = new AggregatedMetricsService();

const ProductService = require("../services/product-service");
const productService = new ProductService();

const EventService = require("../services/event-service");
const eventService = new EventService();

const formatElasticsearchDate = (dateStr) => {
  return dateStr
    ? dayjs(dateStr, "DD MMMM YYYY").format("YYYY-MM-DD")
    : undefined;
};

const constant = require("../util/constant.js");

router.get(
  "/metrics/products/:productId/unique-readership-by-organization",
  /*
      #swagger.summary = 'Retrieve unique readership by organization for a product'
      #swagger.tags = ['Metrics']
      #swagger.parameters['productId'] = {
        in: 'path',
        description: 'ID of the product to retrieve readership data for',
        required: true,
        type: 'string'
      }
      #swagger.parameters['readership_start_date'] = {
        in: 'query',
        description: 'Start date for the readership data in the format "DD MMMM YYYY"',
        required: false,
        type: 'string'
      }
      #swagger.parameters['readership_end_date'] = {
        in: 'query',
        description: 'End date for the readership data in the format "DD MMMM YYYY"',
        required: false,
        type: 'string'
      }
      #swagger.responses[200] = {
        schema: {
          $ref: '#/definitions/ReadershipData'
        }
      }
      #swagger.responses[500] = {
        schema: {
          $ref: '#/definitions/ErrorResponse'
        }
      }
     */
  async (req, res, next) => {
    await runAsUser(req, res, async (currentUser, req, res) => {
      try {
        const { productId } = req.params;
        const { readership_start_date, readership_end_date } = req.query;

        const formattedStartDate = formatElasticsearchDate(
          readership_start_date,
        );
        const formattedEndDate = formatElasticsearchDate(readership_end_date);

        const readershipData =
          await metricsService.getUniqueReadershipByOrganizationForProduct(
            productId,
            formattedStartDate,
            formattedEndDate,
          );

        res.json(readershipData);
      } catch (error) {
        KiwiStandardResponsesExpress.standardErrorResponse(
          500,
          `Failed to retrieve unique readership by organization for product: ${error.message}`,
          res,
        );
      }
    });
  },
);

//TODO: Rather than operate on the product model, we should just get print count from the event logs
// service but that will require fetching by ajax on the client side, so need to fix Rails app first.
router.post("/metrics/products/:productId/record-email", async (req, res) => {
  /*
    #swagger.summary = 'Record email count for a product'
    #swagger.tags = ['Metrics']
    #swagger.parameters['productId'] = {
      in: 'path',
      description: 'ID of the product to record email count for',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      schema: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: 'The updated email count for the product'
          }
        }
      }
      #swagger.responses[500] = {
        schema: {
          $ref: '#/definitions/ErrorResponse'
        }
      } 
    }
   */
  await runAsUser(req, res, async (currentUser, req, res) => {
    const { productId } = req.params;

    try {
      const product = await productService.incrementEmailCount(
        productId,
        currentUser.id,
      );
      res.json({ count: product.email_count });
    } catch (error) {
      KiwiStandardResponsesExpress.standardErrorResponse(
        500,
        `Failed to increment email_count for product: ${error.message}`,
        res,
      );
    }

    try {
      await eventService.registerEvent(
        constant.EVENT_TYPES.PRODUCT_PRINT,
        currentUser.id,
        productId,
      );
    } catch (error) {
      console.error(`Failed to register PRODUCT_PRINT event: ${error.message}`);
    }
  });
});

//TODO: Rather than operate on the product model, we should just get print count from the event logs
// service but that will require fetching by ajax on the client side, so need to fix Rails app first.
router.post("/metrics/products/:productId/record-print", async (req, res) => {
  /*
    #swagger.summary = 'Record print count for a product'
    #swagger.tags = ['Metrics']
    #swagger.parameters['productId'] = {
      in: 'path',
      description: 'ID of the product to record print count for',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      schema: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: 'The updated print count for the product'
          }
        }
      }
      #swagger.responses[500] = {
        schema: {
          $ref: '#/definitions/ErrorResponse'
        }
      }
    }
   */
  await runAsUser(req, res, async (currentUser, req, res) => {
    const { productId } = req.params;

    try {
      const product = await productService.incrementPrintCount(
        productId,
        currentUser.id,
      );
      res.json({ count: product.print_count });
    } catch (error) {
      KiwiStandardResponsesExpress.standardErrorResponse(
        500,
        `Failed to increment print_count for product: ${error.message}`,
        res,
      );
    }

    try {
      await eventService.registerEvent(
        constant.EVENT_TYPES.PRODUCT_PRINT,
        currentUser.id,
        productId,
      );
    } catch (error) {
      console.error(`Failed to register PRODUCT_PRINT event: ${error.message}`);
    }
  });
});

module.exports = router;
