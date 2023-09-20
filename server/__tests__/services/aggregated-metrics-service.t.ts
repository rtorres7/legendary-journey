import "jest-extended";

import crypto from 'crypto';
import elasticsearch from "@elastic/elasticsearch";
import mongoose from "mongoose";
import dayjs from "dayjs";

import { logger } from "../../src/config/logger";
import { ElasticSearchExtension, MongoExtension } from "@kiwiproject/kiwi-test-js";

import constant from "../../src/util/constant.js";
import AggregatedMetricsService from "../../src/services/aggregated-metrics-service";
import EventService from "../../src/services/event-service";
import { UserInfo } from "../../src/models/user_info";
import { ElasticSearchUtils } from "../__utils__/containerUtils";

jest.mock("../../src/services/user-service.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      findById: jest.fn().mockImplementation((id) => {
        return { id, organization: "ABC" };
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

    await ElasticSearchUtils.createIndex(esClient, "eventlogs", constant.indices[1].mappings, []);

    eventService = new EventService();
    metricsService = new AggregatedMetricsService();
  });

  afterAll(async () => {
    await esClient.close();
  });

  beforeEach(async () => {
    await mongoose.connect(mongoUrl);
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  /**
   * 
   */
  describe("userInfo", () => {
    it("should get and set values", async () => {
      {
        const userInfo = await UserInfo.findByUserId("user-1");
        expect(userInfo.userId).toEqual("user-1");
        expect(userInfo.meta).toBeEmptyObject();
        userInfo.setMeta("key-1", "value 1");
        userInfo.setMeta("key-2", "value 2");
        await userInfo.save();
      }
      {
        const userInfo = await UserInfo.findByUserId("user-1");
        expect(userInfo.getMeta("key-1")).toEqual("value 1");
        expect(userInfo.getMeta("key-2")).toEqual("value 2");
        userInfo.setMeta("key-1", null);
        userInfo.setMeta("key-2", "value 2a");
        userInfo.setMeta("key-3", "value 3");
        await userInfo.save();
      }
      {
        const userInfo = await UserInfo.findByUserId("user-1");
        console.log(userInfo);
        expect(userInfo.getMeta("key-1")).toBeUndefined();
        expect(userInfo.getMeta("key-2")).toEqual("value 2a");
        expect(userInfo.getMeta("key-3")).toEqual("value 3");
        await userInfo.save();
      }
    });
  });

  /**
   * 
   */
  describe("getRecentViewsForUser", () => {

    it("should return no recent products", async() => {
      // no events, should return nothing
      const { total, productIds } = await metricsService.getRecentViewsForUser("2", 0, 4);
      expect(total).toEqual(0);
      expect(productIds).toBeArrayOfSize(0);
    });

    it("should return last 4 products", async () => {
      const randomInt = (max: number) => {
        return Math.floor(Math.random() * max) + 1;
      };

      // insert events with random user and product ids
      const eventProductIds = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const userId = `recent-user-${randomInt(3)}`;
        const eventType = i % 2 === 0 ? constant.EVENT_TYPES.PRODUCT_VIEW : constant.EVENT_TYPES.PRODUCT_SAVE;
        const productId = `${userId}-${eventType.split("_")[1].toLowerCase()}-product-${randomInt(10)}`;
        await eventService.registerEvent(eventType, userId, productId);
        if (userId === "recent-user-2" && eventType === constant.EVENT_TYPES.PRODUCT_VIEW) {
          // save product view events for user 2
          if (eventProductIds.has(productId)) {
            eventProductIds.delete(productId); // remove since set maintains insertion order
          }
          eventProductIds.add(productId);
        }
      }
      // insert final event to "force wait" (elastic waits until indexing is finished)
      await eventService.registerEvent(constant.EVENT_TYPES.PRODUCT_VIEW, 1, `user-0-product-0`, {}, true);
      // await new Promise((resolve) => { setTimeout(resolve, 2000); });

      // expect results to be the last 4 view events in reverse chronological order
      const expected = Array.from(eventProductIds.values()).slice(-4).reverse();
      expect(expected).toBeArrayOfSize(4);

      const { total, productIds } = await metricsService.getRecentViewsForUser("recent-user-2", 0, 4); // from 0, size 4
      expect(total).toEqual(eventProductIds.size);
      expect(productIds).toBeArrayOfSize(4);

      expect(expected).toEqual(expected);
    });

    /*
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
    */
  });

  //
  describe("getRecentPublishedForOrg", () => {

    it("should return no recently published products", async() => {
      // no events, should return nothing
      const org = crypto.randomBytes(2).toString('hex');
      const results = await metricsService.getRecentPublishedForOrg(org);
      expect(results.length).toEqual(0);
    });

    it("should return recently published", async () => {
      const randomInt = (max: number) => {
        return Math.floor(Math.random() * max) + 1;
      };

      // insert events with random product ids
      const productIds = new Set<string>();
      const org = crypto.randomBytes(2).toString('hex');
      const meta = {
        datePublished: dayjs().subtract(randomInt(100), 'minute'),
        producingOffices: [ { code: org, name: org } ]
      };
      for (let i = 0; i < 100; i++) {
        const userId = `recent-published-${randomInt(10)}`;
        const eventType = constant.EVENT_TYPES.PRODUCT_PUBLISH;
        const productId = `recent-published-product-${randomInt(10)}`;
        await eventService.registerEvent(eventType, userId, productId, meta);
        productIds.add(productId);
      }
      // insert final event to "force wait" (elastic waits until indexing is finished)
      await eventService.registerEvent(constant.EVENT_TYPES.PRODUCT_VIEW, 1, `product-last`, null, true);
      // await new Promise((resolve) => { setTimeout(resolve, 2000); });

      // expect results all recently published products in the last 90 days
      const results = await metricsService.getRecentPublishedForOrg(org);
      expect(results).toBeArrayOfSize(productIds.size);
    });
  });
});
