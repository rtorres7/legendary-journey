var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AlertsSchema = new Schema(
  {
    id: Number,
    title: String,
    message: String,
    expiresIn: Number,
    start_at: Date,
    end_at: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

var Alerts = mongoose.model("Alert", AlertsSchema, "alerts");
module.exports = Alerts;
