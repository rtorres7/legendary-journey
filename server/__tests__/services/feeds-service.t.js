const { loadFeeds, clearFeeds } = require("../__utils__/dataLoader");
const { Sequelize } = require("sequelize");
const { PostgresExtension } = require("@kiwiproject/kiwi-test-js");
const _ = require("lodash");

describe("Feeds Service", () => {
  let service;
  let postgresUri;

  beforeAll(async () => {
    await PostgresExtension.setupNewDatabase("feeds");
    postgresUri = PostgresExtension.getPostgresUriWithDb("feeds");
    process.env.POSTGRES_CONNECTION_URL = postgresUri;
  });

  beforeEach(() => {
    const FeedsService = require("../../src/services/feeds-service");
    service = new FeedsService();
  });

  afterEach(async () => {
    await clearFeeds(postgresUri);
  });

  afterAll(async () => {
    await PostgresExtension.dropDatabase("feeds");
  }, 120_000);

  describe("finders", () => {
    beforeEach(async () => {
      await loadFeeds(postgresUri);
    });

    describe("findAllFeeds", () => {
      it("should return all feeds", async () => {
        const sequelize = new Sequelize(postgresUri);
        const feedsModel = require("../../src/models/feed");
        feedsModel(sequelize);

        const originalFeeds = await sequelize.models.Feed.findAll();
        const feeds = await service.findAllFeeds();

        expect(originalFeeds).toHaveLength(1);
        expect(feeds).toHaveLength(1);
        expect(originalFeeds[0].name).toEqual("Test Feed #1");
        expect(feeds[0].name).toEqual("Test Feed #1");
      });
    });

    describe("findById", () => {
      it("should return a feed with the given id", async () => {
        const sequelize = new Sequelize(postgresUri);
        const feedsModel = require("../../src/models/feed");
        feedsModel(sequelize);
        const originalFeeds = await sequelize.models.Feed.findAll();

        const feed = await service.findFeedById(_.first(originalFeeds).id);

        expect(feed.name).toEqual("Test Feed #1");
        expect(feed.searchParams).toEqual(
          "https://localhost:8443/search?text=test123",
        );
        expect(feed.state).toEqual("Draft");
        expect(feed.classification).toEqual("U");
      });
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
      console.log(savedFeed);
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

      const updated = await service.updateFeed(original.id, {
        name: "Test Feed #3",
      });

      expect(updated.name).toEqual("Test Feed #3");
    });
  });

  describe("deleteFeed", () => {
    it("should delete the given feed", async () => {
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
