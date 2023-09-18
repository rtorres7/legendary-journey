const request = require("supertest");
const { setupAppWithUser } = require("../__utils__/expressUtils");

jest.mock("../../src/services/feeds-service.js", () => {
  return jest.fn().mockImplementation(() => {
    const newFeed = {
      id: 1,
      name: "Test Feed #1",
      searchParams: "https://localhost:8443/search?text=test123",
      state: "Draft",
      classification: "U",
    };
    const newFeed2 = {
      id: 2,
      name: "Test Feed #2",
      searchParams: "https://localhost:8443/search?text=test1234",
      state: "Draft",
      classification: "U",
    };
    return {
      findAllFeeds: jest.fn().mockImplementation(() => {
        return [newFeed, newFeed2];
      }),
      findFeedById: jest.fn().mockImplementation(() => {
        return newFeed;
      }),
      createFeed: jest.fn().mockImplementation((data) => {
        return {
          id: 1,
          name: data.name,
          searchParams: data.searchParams,
          state: data.state,
          classification: data.classification,
        };
      }),
      updateFeed: jest.fn().mockImplementation((id, data) => {
        return {
          id: id,
          name: data.name,
          searchParams: data.searchParams,
          state: data.state,
          classification: data.classification,
        };
      }),
      deleteFeed: jest.fn(),
    };
  });
});

/*********************************************************************************************************
 * Currently still uses "special_editions" in routes; we should switch all these to "feeds" at some point
 *********************************************************************************************************/
describe("Feeds Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.THROW_TEST_ERROR;
  });

  describe("GET /feeds", () => {
    it("should return all feeds", () => {
      const router = require("../../src/routes/feeds");
      const app = setupAppWithUser(router, { id: 1 });

      return request(app)
        .get("/feeds")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.length).toBe(2);

          const ids = res.body.map((feed) => feed.name);
          expect(ids).toStrictEqual(["Test Feed #1", "Test Feed #2"]);
        });
    });
  });

  describe("GET /feeds/:id", () => {
    it("should return the feed with the given id", () => {
      const router = require("../../src/routes/feeds");
      const app = setupAppWithUser(router, { id: 1 });

      return request(app)
        .get("/feeds/1")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.name).toEqual("Test Feed #1");
        });
    });
  });

  describe("POST /feeds", () => {
    it("should create a feed", () => {
      const router = require("../../src/routes/feeds");
      const app = setupAppWithUser(router, { id: 1 });

      const newFeed = {
        name: "Test Feed #3",
        searchParams: "https://localhost:8443/search?text=test345",
        state: "Draft",
        classification: "U",
      };

      return request(app)
        .post("/feeds")
        .send(newFeed)
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          expect(res.body.name).toBe("Test Feed #3");
          expect(res.body.id).toBeGreaterThan(0);
        });
    });
  });

  describe("PUT /feeds/:collectionId", () => {
    it("should update a feed", async () => {
      const router = require("../../src/routes/feeds");
      const app = setupAppWithUser(router, { id: 1 });

      return request(app)
        .put(`/feeds/1`)
        .send({
          name: "Updated name",
          searchParams: "toasted",
          state: "Posted",
          classification: "S",
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.name).toBe("Updated name");
          expect(res.body.searchParams).toBe("toasted");
          expect(res.body.state).toBe("Posted");
          expect(res.body.classification).toBe("S");
        });
    });
  });

  describe("DELETE /feeds/:collectionId", () => {
    it("should delete a feed", async () => {
      const router = require("../../src/routes/feeds");
      const app = setupAppWithUser(router, { id: 1 });

      return request(app).delete(`/feeds/1`).expect(204);
    });
  });
});
