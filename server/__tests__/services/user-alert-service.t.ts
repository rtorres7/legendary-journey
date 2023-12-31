import "jest-extended";

import elasticsearch from "@elastic/elasticsearch";
import crypto from "crypto";
import mongoose from "mongoose";

import {
  ElasticSearchExtension,
  MongoExtension,
} from "@kiwiproject/kiwi-test-js";

import dayjs from "dayjs";
import { UserAlertReadState, UserAlertType, IUserAlert } from "../../src/models/user_alert";
import { EventType } from "../../src/models/event_log";
import { UserAlertService } from "../../src/services/user-alert-service";
import EventService from "../../src/services/event-service";
import constant from "../../src/util/constant.js";
import { ElasticSearchUtils } from "../__utils__/containerUtils";
import { config } from "../../src/config/config";

jest.mock("../../src/services/user-service.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      findById: jest.fn().mockImplementation((id) => {
        return Promise.resolve({ id, organization: "DNI" });
      }),
    };
  });
});

describe("UserAlertService", () => {
  let esUrl: string;
  let esClient: elasticsearch.Client;
  let mongoUrl: string;
  let userAlertService: UserAlertService;

  /** */
  beforeAll(async () => {
    mongoUrl = MongoExtension.getMongoUriWithDb("alert-service");

    esUrl = ElasticSearchExtension.getElasticSearchUrl();
    process.env.ES_URL = esUrl;
    config.elasticsearch.url = esUrl;
    esClient = new elasticsearch.Client({ nodes: esUrl });

    await ElasticSearchUtils.createIndex(
      esClient,
      "eventlogs",
      constant.indices[1].mappings,
      [],
    );

    userAlertService = new UserAlertService();
  });

  afterAll(async () => {
    await esClient.close();
  });

  /** */
  beforeEach(async () => {
    await mongoose.connect(mongoUrl);
  });

  /** */
  afterEach(() => {
    mongoose.connection.close();
  });

  /** */
  const buildAlert = function (
    overrides: Partial<IUserAlert> = {},
  ): Partial<IUserAlert> {
    return {
      title: "title test",
      message: "message test",
      userId: randStr("user-id-1"),
      productNumber: randStr("product-number-1"),
      createdBy: "user-id-2",
      alertType: UserAlertType.PRODUCT_PUBLISHED,
      readState: UserAlertReadState.UNREAD,
      eventLogId: randStr("event-id"),
      meta: {
        test: "meta.test",
      },
      ...overrides,
    };
  };

  const randStr = function (prefix?: string): string {
    return (
      (prefix ? `${prefix}-` : "") +
      crypto.randomBytes(4).toString("hex").toLowerCase()
    );
  };

  /** */
  describe("alerts", () => {
    describe("create alert", () => {
      it("should create a new alert", async () => {
        // create alert
        const t = buildAlert();
        const alert1 = await userAlertService.createAlert(t);
        expect(alert1.id).toBeDefined();
        expect(alert1._id).toBeDefined();
        expect(alert1.readState).toEqual(UserAlertReadState.UNREAD);
        expect(alert1.createdAt).toBeDefined();
        expect(alert1.updatedAt).toBeDefined();
        // console.log(alert1);
        // console.log(alert1.toJSON());

        // retrieve alert
        const alert2 = await userAlertService.findById(alert1.id);
        expect(alert2.toJSON()).toMatchObject(alert1.toJSON());

        // update alert
        const alert3 = await userAlertService.updateAlert(alert1.id, {
          readState: UserAlertReadState.READ,
        });
        expect(alert3.id).toEqual(alert1.id);
        expect(alert3.readState).toEqual(UserAlertReadState.READ);
      });
    });

    describe("counts", () => {
      it("should return empty count", async () => {
        const user = { id: randStr("counts") };
        const { total, unread } = await userAlertService.counts(user);
        expect(total).toEqual(0);
        expect(unread).toEqual(0);
      });
      it("should get counts all all alerts for user", async () => {
        const user = { id: randStr("counts") };
        for (let i = 0; i < 10; i++) {
          const t = buildAlert({ userId: user.id });
          t.productNumber = randStr("product-number");
          t.readState =
            i % 2 == 0 ? UserAlertReadState.READ : UserAlertReadState.UNREAD;
          await userAlertService.createAlert(t);
        }
        const { total, unread } = await userAlertService.counts(user);
        expect(total).toEqual(10);
        expect(unread).toEqual(5);
      });
    });

    describe("list alerts", () => {
      it("should return empty page", async () => {
        const user = { id: randStr("list-1") };
        const page = await userAlertService.findByUserPaged(user);
        expect(page).toBeDefined();
        expect(page.number).toEqual(1); // page number
        expect(page.size).toEqual(10); // page size
        expect(page.numberOfElements).toEqual(0);
        expect(page.totalElements).toEqual(0);
      });

      fit("should return alerts page", async () => {
        const user = { id: randStr("list-2") };
        for (let i = 0; i < 20; i++) {
          const t = buildAlert({ userId: user.id });
          await userAlertService.createAlert(t);
        }
        {
          const eventIds = await userAlertService.findProcessedEventIds(
            user,
            UserAlertType.PRODUCT_PUBLISHED,
            dayjs().subtract(1, "day").toDate(),
          );
          expect(eventIds.size).toEqual(20);
        }
        {
          const page = await userAlertService.findByUserPaged(user);
          expect(page).toBeDefined();
          expect(page.content).toBeArrayOfSize(10);
          expect(page.number).toEqual(1);
          expect(page.size).toEqual(10);
          expect(page.totalPages).toEqual(2);
          expect(page.totalElements).toEqual(20);
        }
        {
          const page = await userAlertService.findByUserPaged(
            user,
            10,
            2,
            10,
            "desc",
          ); // skip 10
          expect(page).toBeDefined();
          expect(page.content).toBeArrayOfSize(10);
          expect(page.number).toEqual(2);
          expect(page.size).toEqual(10);
          expect(page.totalPages).toEqual(2);
          expect(page.totalElements).toEqual(20);
        }
        {
          const page = await userAlertService.findByUserPaged(
            user,
            5,
            1,
            0,
            "desc",
          );
          expect(page).toBeDefined();
          expect(page.content).toBeArrayOfSize(5);
          expect(page.number).toEqual(1);
          expect(page.size).toEqual(5);
          expect(page.totalPages).toEqual(4);
          expect(page.totalElements).toEqual(20);
        }
      });
    });

    describe("createAlertsFromPublishedEventLogs", () => {
      it("should create alerts from product publish events", async () => {
        const org = crypto.randomBytes(2).toString("hex");
        const user = {
          id: randStr("published"),
          organization: org,
        };

        const eventService = new EventService();
        for (let i = 0; i < 10; i++) {
          const product = {
            productNumber: randStr("alert-prod-2"),
            datePublished: dayjs().toDate(),
            title: randStr("alert-title"),
            producingOffices: [{ name: org, code: org }],
          };

          await eventService.registerEvent(
            EventType.PRODUCT_PUBLISH,
            user.id,
            product.productNumber,
            {
              datePublished: product.datePublished,
              producingOffices: product.producingOffices?.map(
                ({ name, code }) => ({ name, code }),
              ),
              title: product.title,
            },
          );

          // console.log(event);
        }
        // insert final event to "force wait" (elastic waits until indexing is finished)
        await eventService.registerEvent(
          constant.EVENT_TYPES.PRODUCT_VIEW,
          1,
          `product-last`,
          null,
          true,
        );

        const alerts = await userAlertService.createAlertsFromPublishedEventLogs(
          user,
        );
        expect(alerts).toBeArrayOfSize(10);
      });
    });
  });
});
