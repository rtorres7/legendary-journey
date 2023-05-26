const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpecialEditionsSchema = new Schema(
  {
    concepts: {
      posted: [
        {
          name: String,
          image_path: String,
          id: Number,
        },
      ],
      draft: [
        {
          name: String,
          image_path: String,
          id: Number,
        },
      ],
      archived: [
        {
          name: String,
          image_path: String,
          id: Number,
        },
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const SpecialEditions = mongoose.model(
  "SpecialEditions",
  SpecialEditionsSchema,
  "special_editions"
);
module.exports = SpecialEditions;
