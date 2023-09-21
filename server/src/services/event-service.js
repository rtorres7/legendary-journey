const { EventLog } = require("../models/event_log");
// const ProductService = require("../services/product-service");
const UserService = require("./user-service");
const { logger } = require("../config/logger");

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
        refresh: wait ? "wait_for" : false
      });

      return event;
    } catch (err) {
      logger.error("Error registering event", err);
    }
  }
}

module.exports = EventService;
