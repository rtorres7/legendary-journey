const { EventLog } = require("../models/event_log");
const UserService = require("./user-service");
const { logger } = require("../config/logger");
const { KiwiPage, KiwiSort } = require("@kiwiproject/kiwi-js");
const Article = require("../models/articles");

class EventService {
  constructor() {
    // this.productService = new ProductService();
    this.userService = new UserService();
    this.client = require("../data/elasticsearch");
    this.index = "eventlogs";
  }

  async registerEvent(eventType, userId, productId, meta = {}, wait = false) {
    try {
      const event = new EventLog({
        eventType,
        userId,
        productId,
        meta,
      });
      await event.save();

      const user = await this.userService.findById(userId);
      if (!user) {
        console.error("User not found");
      }

      const enrichedData = {
        eventType,
        userId,
        productId,
        meta,
        timestamp: event.timestamp,
        organization: user.Organization,
      };

      await this.client.index({
        index: this.index,
        id: event.id,
        document: enrichedData,
        refresh: wait ? "wait_for" : false,
      });

      return event;
    } catch (err) {
      logger.error("Error registering event", err);
    }
  }

  async findPageOfRecentlyViewedForUser(userId, page, limit, offset) {
    let recentlyViewedProducts = await this.#findRecentlyViewedProductsForUser(
      userId,
      limit,
      offset,
    );
    recentlyViewedProducts = recentlyViewedProducts.map(
      (product) => product.product,
    );

    const recentlyViewedCount = await this.#countRecentlyViewedProductsForUser(
      userId,
    );

    return KiwiPage.of(page, limit, recentlyViewedCount, recentlyViewedProducts)
      .usingOneAsFirstPage()
      .addKiwiSort(KiwiSort.of("timestamp", "desc"));
  }

  async #findRecentlyViewedProductsForUser(userId, limit, offset) {
    return await EventLog.aggregate()
      .match({
        eventType: "PRODUCT_VIEW",
        userId: userId,
      })
      .sort({ timestamp: -1 })
      .group({
        _id: "$productId",
        timestamp: { $first: "$timestamp" },
      })
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit)
      .lookup({
        from: Article.collection.name,
        localField: "_id",
        foreignField: "productNumber",
        as: "product",
      })
      .unwind("product")
      .project({
        product: 1,
      })
      .lookup({
        from: EventLog.collection.name,
        localField: "product.productNumber",
        foreignField: "productId",
        as: "eventLogs",
      })
      .addFields({
        product: {
          views: {
            $size: "$eventLogs",
          },
        },
      })
      .exec();
  }

  async #countRecentlyViewedProductsForUser(userId) {
    const count = await EventLog.aggregate()
      .match({
        eventType: "PRODUCT_VIEW",
        userId: userId,
      })
      .group({
        _id: "$productId",
        timestamp: { $first: "$timestamp" },
      })
      .count("total")
      .exec();

    if (count.length === 0) {
      return 0;
    }

    return count[0].total;
  }
}

module.exports = EventService;
