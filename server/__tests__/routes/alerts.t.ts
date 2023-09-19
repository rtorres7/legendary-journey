import "jest-extended";

import crypto from "crypto";
import mongoose from "mongoose";
import request from "supertest";

import { MongoExtension } from "@kiwiproject/kiwi-test-js";
import { setupAppWithUser } from "../__utils__/expressUtils";

import router from "../../src/routes/alerts";

import { AlertReadState, AlertType, IAlert } from "../../src/models/alert";
import { AlertService } from "../../src/services/alert-service";


describe("Alert Routes", () => {

  let mongoUrl: string;
  let alertService: AlertService;

  /** */
  beforeAll(async () => {
    mongoUrl = MongoExtension.getMongoUriWithDb("alert-service");
    alertService = new AlertService();
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
  const buildAlert = function(overrides: Partial<IAlert> = {}): Partial<IAlert> {
    return {
      title: "title test",
      message: "message test",
      userId: randStr("user-id-1"),
      productNumber: randStr("product-number-1"),
      createdBy: "user-id-2",
      type: AlertType.PRODUCT_PUBLISHED,
      readState: AlertReadState.UNREAD,
      meta: {
        "test": "meta.test"
      },
      ...overrides
    };
  };

  const randStr = function(prefix?: string): string {
    return (prefix ? `${prefix}-` : "") + crypto.randomBytes(4).toString("hex").toLowerCase();
  };

  describe("POST /alert/", () => {
    it("should create an alert", async () => {
      const user = { id: randStr("alert-create") };
      const app = setupAppWithUser(router, user);
      const postData = buildAlert({ readState: null });
      return request(app)
        .post("/alert")
        .send(postData)
        .expect(201)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          expect(res.body.createdBy).toEqual(user.id);
          expect(res.body.title).toEqual(postData.title);
          expect(res.body.userId).toEqual(postData.userId);
          expect(res.body.readState).toEqual(AlertReadState.UNREAD);
        });
    });
  });

  describe("GET /alert/id", () => {
    it("should create an alert", async () => {
      const user = { id: randStr("alert-get") };
      const app = setupAppWithUser(router, user);
      const alert = await alertService.createAlert(buildAlert({ userId: user.id }));
      return request(app)
        .get(`/alert/id/${alert.id}`)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          console.log(res.body);
          expect(res.body.id).toEqual(alert.id);
        });
    });
  });

  describe("GET /alert/list", () => {
    it("should return an empty JSON array", async () => {
      const user = { id: randStr("alert-list") };
      const app = setupAppWithUser(router, user);
      return request(app)
        .get("/alert/list")
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
      const user = { id: randStr("alert-list") };
      for (let i = 0; i < 20; i++) {
        const t = buildAlert({ userId: user.id });
        await alertService.createAlert(t);
      }
      const app = setupAppWithUser(router, user);
      return request(app)
        .get("/alert/list")
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
