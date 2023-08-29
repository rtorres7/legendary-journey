import "jest-extended";

import elasticsearch from "@elastic/elasticsearch";
import mongoose from "mongoose";

import { logger } from "../../src/config/logger";
import { ElasticSearchExtension, MongoExtension } from "@kiwiproject/kiwi-test-js";

import constant from "../../src/util/constant.js";
import AggregatedMetricsService from "../../src/services/aggregated-metrics-service";
import EventService from "../../src/services/event-service";


jest.mock("../../src/services/user-service.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      findById: jest.fn().mockImplementation((id) => {
        return { id };
      }),
    };
  });
});


describe("aggregated-metrics-service", () => {
  let mongoUrl: string;
  let esUrl: string;
  let esClient: elasticsearch.Client;
  let eventService: EventService;
  let metricsService: AggregatedMetricsService;

  const USER = { id: 1, dataValues: { organization: "AGRICULTURE" } };
  beforeAll(async () => {
    mongoUrl = MongoExtension.getMongoUriWithDb("metrics");
    process.env.MONGO_DATABASE_URL = mongoUrl;

    esUrl = ElasticSearchExtension.getElasticSearchUrl();
    process.env.ES_URL = esUrl;
    esClient = new elasticsearch.Client({ nodes: esUrl});

    if (await esClient.indices.exists({ index: "eventlogs" })) {
      logger.info("index eventlogs exists");
    } else {
      await ElasticSearchExtension.createIndex("eventlogs", constant.indices[1].mappings, []);
    }

    eventService = new EventService();
    metricsService = new AggregatedMetricsService();
  });

  beforeEach(async () => {
    await mongoose.connect(mongoUrl);
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  
  describe("getRecentViewsForUser", () => {

    it("should return no recent products", async() => {
      // no events, should return nothing
      const results = await metricsService.getRecentViewsForUser(2);
      expect(results).toBeArrayOfSize(0);
    });

    it("should return last 4 products", async () => {
      const randomInt = (max: number) => {
        return Math.floor(Math.random() * max) + 1;
      };

      // insert events with random user and product ids
      const productIds = new Set();
      for (let i = 0; i < 100; i++) {
        const userId = randomInt(3);
        const eventType = i % 2 === 0 ? constant.EVENT_TYPES.PRODUCT_VIEW : constant.EVENT_TYPES.PRODUCT_SAVE;
        const productId = `user-${userId}-${eventType.split("_")[1].toLowerCase()}-product-${randomInt(10)}`;
        await eventService.registerEvent(eventType, userId, productId); // do not force wait
        if (userId === 2 && eventType === constant.EVENT_TYPES.PRODUCT_VIEW) {
          // save product view events for user 2
          if (productIds.has(productId)) {
            productIds.delete(productId); // remove since set maintains insertion order
          }
          productIds.add(productId);
        }
      }
      // insert event to force wait for elastic to finish indexing
      await eventService.registerEvent(constant.EVENT_TYPES.PRODUCT_VIEW, 1, `user-0-product-0`, {}, true);
      // await new Promise((resolve) => { setTimeout(resolve, 2000); });

      // expect results to be the last 4 view events in reverse chronological order
      const expected = Array.from(productIds.values()).slice(-4).reverse();
      expect(expected).toBeArrayOfSize(4);

      const results = await metricsService.getRecentViewsForUser(2);
      expect(results).toBeArrayOfSize(4);

      expect(results).toEqual(expected);
    });

    xit("bulk testing", async () => {
      const client = new elasticsearch.Client({ nodes: "http://localhost:9200" });
      await client.indices.create({ index: "eventlogs", mappings: constant.indices[1].mappings as any });

      const randomEvent = (userId: number) => {
        return {
          eventType: constant.EVENT_TYPES.PRODUCT_VIEW,
          userId,
          productId: `product-${Math.floor(Math.random() * 20)}`,
          meta: {},
          timestamp: new Date(new Date().valueOf() - Math.random() * 1e12),
          organization: {},
        };
      };

      const bulk = [];
      for (let i = 0; i < 30; i++) {
        bulk.push({ index: { _index: "eventlogs" } });
        bulk.push(randomEvent(2));
      }
      await client
        .bulk({ body: bulk, refresh: "wait_for" })
        .then((response) => {
          console.log(response);
        })
        .catch((reason) => {
          console.error(reason);
        });

      console.log(await client.search({ query: { match_all: {} } }));
    });
  });
});
