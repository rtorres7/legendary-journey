const { PostgreSqlContainer } = require("testcontainers");
const { loadFeeds } = require("../__utils__/dataLoader");

describe("Feeds Service", () => {
  let postgresContainer;
  let service;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();
    process.env.POSTGRES_CONNECTION_URL = postgresContainer.getConnectionUri();

    // Load Feeds
    await loadFeeds(postgresContainer.getConnectionUri());
  }, 120_000);

  beforeEach(() => {
    const FeedsService = require("../../src/services/feeds");
    service = new FeedsService();
  });

  afterAll(() => {
    postgresContainer.stop();
  });

  describe("findAllFeeds", () => {
    it("should return all feeds", async () => {
      const feeds = await service.findAllFeeds();

      expect(feeds).toHaveLength(1);
    });
  });

  describe("findById", () => {
    it("should return a feed with the given id", async () => {
      const feed = await service.findById(1);

      expect(feed.name).toEqual("Test Feed #1");
      expect(feed.searchParams).toEqual(
        "https://localhost:8443/search?text=test123",
      );
      expect(feed.state).toEqual("Draft");
      expect(feed.classification).toEqual("U");
    });
  });

  describe("createFeed", () => {
    it("should save a new feed", async () => {
      const newFeed = {
        name: "Test Feed #2",
        searchParams: "https://localhost:8443/search?text=test1234",
        state: "Draft",
        classification: "U",
      };
      const savedFeed = await service.createFeed(newFeed);
      expect(savedFeed.id).toBeDefined();
    });
  });

  describe("updateFeed", () => {
    it("should update the given feed", async () => {
      const { models } = require("../../src/data/sequelize");
      const newFeed = {
        name: "Test Feed #7",
        searchParams: "https://localhost:8443/search?text=test12345",
        state: "Draft",
        classification: "U",
      };
      const original = await models.Feed.create(newFeed);

      const updated = await service.Feed(original.id, { name: "Test Feed #3" });

      expect(updated.name).toEqual("Test Feed #3");
    });
  });

  describe("deleteCollection", () => {
    it("should delete the given collection", async () => {
      const { models } = require("../../src/data/sequelize");
      const newFeed = {
        name: "Test Feed #4",
        searchParams: "https://localhost:8443/search?text=test123456",
        state: "Draft",
        classification: "U",
      };
      const original = await models.Feed.create(newFeed);

      await service.deleteFeed(original.id);

      const expected = await models.Feed.findOne({
        where: { id: original.id },
      });
      expect(expected).toBeNull();
    });
  });
});
