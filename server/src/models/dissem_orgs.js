const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DissemOrgsSchema = new Schema(
  {
    ancestry: String,
    ancestry_depth: Number,
    category: String,
    code: String,
    created_at: Date,
    description: String,
    id: Number,
    label: String,
    legacy: Boolean,
    name: String,
    ntk_org: Boolean,
    position: Number,
    updated_at: Date,
    usgov_org: Boolean,
    visible: Boolean,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const DissemOrgs = mongoose.model("DissemOrgs", DissemOrgsSchema, "dissem_orgs");
module.exports = DissemOrgs;
