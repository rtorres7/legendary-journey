const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    attachmentsMetadata: [],
    classification: String,
    classificationXml: String,
    coauthors: [
      {
        name: String,
        code: String,
      },
    ],
    coordinators: [
      {
        name: String,
        code: String,
      },
    ],
    countries: [
      {
        name: String,
        code: String,
      },
    ],
    createdAt: Date,
    datePublished: Date,
    dissemOrgs: [
      {
        name: String,
        code: String,
      },
    ],
    htmlBody: String,
    images: [],
    issues: [
      {
        name: String,
        code: String,
      },
    ],
    legacyCurrentId: String,
    needed: {
      orgs: []
    },
    orgRestricted: Boolean,
    pocInfo: String,
    producingOffices: [
      {
        name: String,
        code: String,
      },
    ],
    productNumber: String,
    productType: {
      name: String,
      code: Number,
    },
    publicationNumber: String,
    publishedBy: {},
    regions: [
      {
        name: String,
        code: String,
      },
    ],
    reportingType: {
      name: String,
      code: String,
    },
    state: {
      type: String,
      default: "draft",
    },
    subregions: [
      {
        name: String,
        code: String,
      },
    ],
    summary: String,
    summaryClassification: String,
    summaryClassificationXml: String,
    title: String,
    titleClassification: String,
    titleClassificationXml: String,
    topics: [
      {
        name: String,
        code: String,
      },
    ],
    updatedAt: Date,
    worldwide: Boolean,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ArticleSchema.virtual("features").get(function() {
  return {
    datePublished: this.datePublished,
    id: this.get("_id"),
    images: this.images,
    needed: this.needed,
    orgRestricted: this.orgRestricted,
    productNumber: this.productNumber,
    productType: this.productType,
    state: this.state,
    summary: this.summary,
    summaryClassification: this.summaryClassification,
    title: this.title,
    titleClassification: this.titleClassification,

    // TODO: Once we update the UI to not need the attributes sub-element we can remove the below
    attributes: {
      date_published: this.datePublished,
      doc_num: this.productNumber,
      id: this.get("_id"),
      images: this.images,
      needed: this.needed && this.needed.orgs && this.needed.orgs.length > 0 ? this.needed : {},
      org_restricted: this.orgRestricted,
      product_type: this.productType.code,
      product_type_name: this.productType.name,
      state: this.state,
      summary: this.summary,
      summary_classification: this.summaryClassification,
      summary_classif: this.summaryClassification,
      title: this.title,
      title_classification: this.titleClassification,
      title_classif: this.titleClassification,
    }
  };
});

ArticleSchema.virtual("forWire").get(function() {
  return {
    datePublished: this.datePublished,
    id: this.get("_id"),
    images: this.images,
    needed: this.needed,
    orgRestricted: this.orgRestricted,
    productNumber: this.productNumber,
    productType: this.productType,
    state: this.state,
    summary: this.summary,
    summaryClassification: this.summaryClassification,
    title: this.title,
    titleClassification: this.titleClassification,

    // TODO: Once we update the UI to not need the attributes sub-element we can remove the below
    attributes: {
      date_published: this.datePublished,
      doc_num: this.productNumber,
      id: this.get("_id"),
      images: this.images,
      needed: this.needed && this.needed.orgs && this.needed.orgs.length > 0 ? this.needed : {},
      org_restricted: this.orgRestricted,
      product_type: this.productType.name,
      state: this.state,
      summary: this.summary,
      summary_classification: this.summaryClassification,
      summary_classif: this.summaryClassification,
      title: this.title,
      title_classification: this.titleClassification,
      title_classif: this.titleClassification,
    }
  };
});

ArticleSchema.virtual("indexable").get(function () {
  return {
    classification: this.classification,
    classificationXml: this.classificationXml,
    countries: this.countries && this.countries.map(country => country.code),
    datePublished: this.datePublished,
    htmlBody: this.htmlBody,
    id: this.get("_id"),
    issues: this.issues && this.issues.map(issue => issue.code),
    needed: this.needed || { orgs: [] },
    orgRestricted: this.orgRestricted || false,
    producingOffices: this.producingOffices && this.producingOffices.map(office => office.code),
    productNumber: this.productNumber,
    productType: this.productType && this.productType.code,
    regions: this.regions && this.regions.map(region => region.code),
    reportingType: this.reportingType && this.reportingType.code,
    subregions: this.subregions && this.subregions.map(subregion => subregion.code),
    summary: this.summary,
    summaryClassification: this.summaryClassification,
    title: this.title,
    titleClassification: this.titleClassification,
    topics: this.topics && this.topics.map(topic => topic.code),
    worldwide: this.worldwide,
  };
});

ArticleSchema.virtual("data.document").get(function () {
  return {
    classification: this.classification,
    coauthors: this.coauthors,
    coordinators: this.coordinators,
    countries: this.countries,
    datePublished: this.datePublished,
    dissemOrgs: this.dissemOrgs,
    htmlBody: this.htmlBody,
    id: this.get("_id"),
    issues: this.issues,
    pocInfo: this.pocInfo,
    producingOffices: this.producingOffices,
    productNumber: this.productNumber,
    productType: this.productType,
    publicationNumber: this.publicationNumber,
    regions: this.regions,
    subregions: this.subregions,
    summary: this.summary,
    summaryClassification: this.summaryClassification,
    summaryClassificationXml: this.summaryClassificationXml,
    title: this.title,
    titleClassification: this.titleClassification,
    titleClassificationXml: this.titleClassificationXml,
    topics: this.topics,
    worldwide: this.worldwide,

    // TODO: The following can go away once the UI is updated with the new model/fields
    classification_xml: this.classificationXml,
    date_published: this.datePublished,
    doc_num: this.productNumber,
    dissem_orgs: this.dissemOrgs,
    html_body: this.htmlBody,
    poc_info: this.pocInfo,
    producing_offices: this.producingOffices,
    product_type_id: this.productType.code,
    publication_number: this.publicationNumber,
    summary_classif: this.summaryClassification,
    summary_classif_xml: this.summaryClassificationXml,
    title_classif: this.titleClassification,
    title_classif_xml: this.titleClassificationXml,
  };
});

ArticleSchema.virtual("data.details").get(function () {
  return {
    attachmentsMetadata: this.attachmentsMetadata,
    classification: this.classification,
    coauthors: this.coauthors && this.coauthors.map(author => author.name), // UI needs a list not the objects right now
    coordinators: this.coordinators && this.coordinators.map(coord =>  coord.name), // UI needs a list not the objects right now
    countries: this.countries,
    datePublished: this.datePublished,
    dissemOrgs: this.dissemOrgs,
    htmlBody: this.htmlBody,
    id: this.get("_id"),
    issues: this.issues,
    legacyCurrentId: this.legacyCurrentId,
    pocInfo: this.pocInfo,
    producingOffices: this.producingOffices,
    productNumber: this.productNumber,
    productType: this.productType,
    publicationNumber: this.publicationNumber,
    publishedBy: this.publishedBy,
    regions: this.regions,
    state: this.state,
    subregions: this.subregions,
    summary: this.summary,
    summaryClassification: this.summaryClassification,
    summaryClassificationXml: this.summaryClassificationXml,
    title: this.title,
    titleClassification: this.titleClassification,
    titleClassificationXml: this.titleClassificationXml,
    topics: this.topics,
    worldwide: this.worldwide,

    // TODO: The following can go away once the UI is updated with the new model/fields
    attachments_metadata: this.attachmentsMetadata,
    date_published: this.datePublished,
    display_date: this.datePublished,
    dissem_orgs: this.dissemOrgs,
    doc_num: this.productNumber,
    document: {
      needed: this.needed,
      org_restricted: this.orgRestricted,
    },
    feature_date: this.datePublished,
    html_body: this.htmlBody,
    legacy: this.legacyCurrentId !== undefined && this.legacyCurrentId !== '',
    poc_info: this.pocInfo,
    posted_at: this.datePublished,
    producing_offices: this.producingOffices && this.producingOffices.map(office => office.name),
    product_type_id: this.productType.code,
    product_type_name: this.productType.name,
    published_by: this.publishedBy && this.publishedBy.name,
    title_classif: this.titleClassification,
  };
});

const Article = mongoose.model("Article", ArticleSchema, "articles");

module.exports = Article;
