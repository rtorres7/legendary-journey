var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    id: Number,
    notifications: {
      ntk: {},
    },
    authorizations: {
      canManageWire: Boolean,
      canManageSpecialEditions: Boolean,
    },
    name: String,
    email: String,
    roles: [],
    has_org: Boolean,
    organization: String,
    phone_number: String,
    dn: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

var User = mongoose.model("User", UserSchema);
module.exports = User;
