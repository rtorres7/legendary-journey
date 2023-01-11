var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema(
  {
    attributes: {
      title: String,
      title_classification: String,
      summary: String,
      summary_classification: String,
      date_published: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ArticleSchema.virtual("attributes.doc_num").get(function () {
  return this._id;
});

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
