import "jest-extended";

import crypto from "crypto";
import mongoose from "mongoose";
import request from "supertest";

import { MongoExtension } from "@kiwiproject/kiwi-test-js";
import { setupAppWithUser } from "../__utils__/expressUtils";

import router from "../../src/routes/user_alerts";

import { UserAlertReadState, UserAlertType, IUserAlert } from "../../src/models/user_alert";
import { UserAlertService } from "../../src/services/user-alert-service";

describe("User Alert Routes", () => {
  let mongoUrl: string;
  let alertService: UserAlertService;

  /** */
  beforeAll(async () => {
    mongoUrl = MongoExtension.getMongoUriWithDb("alert-service");
    alertService = new UserAlertService();
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
      alertType: UserAlertType.PRODUCT_PUBLISHED,
      readState: UserAlertReadState.UNREAD,
      meta: {
        test: "meta.test",
      },
      createdBy: "user-id-2",
      ...overrides,
    };
  };

  const randStr = function (prefix?: string): string {
    return (
      (prefix ? `${prefix}-` : "") +
      crypto.randomBytes(4).toString("hex").toLowerCase()
    );
  };

  describe("POST /user_alerts/", () => {
    it("should create an alert", async () => {
      const user = { id: randStr("user-alert-create") };
      const app = setupAppWithUser(router, user);
      const postData = buildAlert({ readState: null });
      return request(app)
        .post("/user_alerts")
        .send(postData)
        .expect(201)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          expect(res.body.createdBy).toEqual(user.id);
          expect(res.body.title).toEqual(postData.title);
          expect(res.body.userId).toEqual(postData.userId);
          expect(res.body.readState).toEqual(UserAlertReadState.UNREAD);
        });
    });
  });

  describe("GET /user_alerts/id", () => {
    it("should create an alert", async () => {
      const user = { id: randStr("user-alert-get") };
      const app = setupAppWithUser(router, user);
      const alert = await alertService.createAlert(
        buildAlert({ userId: user.id }),
      );
      return request(app)
        .get(`/user_alerts/id/${alert.id}`)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          // console.log(res.body);
          expect(res.body.id).toEqual(alert.id);
        });
    });
  });

  describe("GET /user_alerts/list", () => {
    it("should return an empty JSON array", async () => {
      const user = { id: randStr("user-alert-list") };
      const app = setupAppWithUser(router, user);
      return request(app)
        .get("/user_alerts/list")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          // console.log(res.body);
          expect(res.body.content).toBeArrayOfSize(0);
          expect(res.body.numberOfElements).toEqual(0);
          expect(res.body.totalElements).toEqual(0);
        });
    });

    it("should return a list of alerts", async () => {
      const user = { id: randStr("user-alert-list") };
      for (let i = 0; i < 20; i++) {
        const t = buildAlert({ userId: user.id });
        await alertService.createAlert(t);
      }
      const app = setupAppWithUser(router, user);
      return request(app)
        .get("/user_alerts/list")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          // console.log(res.body);
          expect(res.body.content).toBeArrayOfSize(10);
          expect(res.body.numberOfElements).toEqual(10);
          expect(res.body.totalElements).toEqual(20);
        });
    });
  });
});
