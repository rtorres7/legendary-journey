const { models } = require("../data/sequelize");
const Feed = require("../models/feed");

class FeedsService {
  constructor() {
    this.index = "feeds";
  }

  async findAllFeeds() {
    // const feeds = Feed.find({}).exec();
    const feeds = await models.Feed.findAll({});
    return feeds;
  }

  async findFeedById(id) {
    const feed = await models.Feed.findByPk(id);
    return feed;
  }

  async createFeed(feed) {
    let savedFeed;
    try {
      savedFeed = await models.Feed.create(feed);
    } catch (error) {
      console.log(
        "There was a problem saving the feed, rolling back database save",
        error,
      );
      await Feed.deleteOne({ _id: feed.id });
      throw new Error(
        "There was a problem saving the feed, rolling back database save",
      );
    }

    return savedFeed;
  }

  async updateFeed(id, feed) {
    console.log("made it to the service, id & feed: ", id, feed);
    const result = await models.Feed.update(feed, {
      where: {
        id: id,
      },
      returning: true,
    });

    return result;
  }

  async deleteFeed(id) {
    await models.Feed.destroy({
      where: {
        id: id,
      },
    });
  }
}

module.exports = FeedsService;
