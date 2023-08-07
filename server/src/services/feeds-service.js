const { models } = require("../data/sequelize");
const Feed = require("../models/feed");

class FeedsService {
  constructor() {
    this.index = "feeds";
    // const sequelize = new Sequelize(postgresUrl);
  }

  async findAllFeeds() {
    // const feeds = Feed.find({}).exec();
    const feeds = await models.Feed.findAll({});
    return feeds;
  }

  async findFeedById(id) {
    const feed = await models.Feed.findById(id);
    return feed;
  }

  //// This method is likely unnecessary - we can just call the product service and not duplicate code here
  // async findPageOfProductsForFeedForUser(){
  // }

  async createFeed(feed) {
    const savedFeed = await feed.save();
    console.log("successfully hit the correct method");
    try {
      await Feed.create(savedFeed);
    } catch (error) {
      console.log(
        "There was a problem saving the feed, rolling back database save",
        error,
      );
      await Feed.deleteOne({ _id: savedFeed.id });
      throw new Error(
        "There was a problem saving the feed, rolling back database save",
      );
    }

    return savedProduct;
  }

  async updateFeed(id, feed) {
    const result = await models.Feed.update(feed, {
      where: {
        id: id,
      },
      returning: true,
    });

    return result[1][0];
  }

  async deleteFeed(id) {
    await models.Collection.destroy({
      where: {
        id: id,
      },
    });
  }
}

module.exports = FeedsService;
