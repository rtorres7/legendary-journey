const mongoose = require("mongoose");
const constant = require("../util/constant.js");
const Schema = mongoose.Schema;

const eventLogSchema = new Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: Object.values(constant.EVENT_TYPES),
      index: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    userId: {
      type: String,
      index: true,
    },
    productId: {
      type: String,
      index: true,
    },
    meta: {
      // This can be a mixed type that captures any additional data associated with the event
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    strict: false,
  },
);

const EventLog = mongoose.model("EventLog", eventLogSchema, "event_log");
module.exports = EventLog;
