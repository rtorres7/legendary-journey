const mongoose = require("mongoose");
const path = require("path");
const { findArticleImage } = require("../util/images");

const Schema = mongoose.Schema;

const DissemSchema = new Schema(
  {
    name: String,
    code: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const AttachmentSchema = new Schema(
  {
    fileName: String,
    mimeType: String,
    createdAt: Date,
    updatedAt: Date,
    fileSize: Number,
    type: String,
    attachmentId: String,
    destination: String,
    visible: Boolean,
    deleted: Boolean,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

AttachmentSchema.virtual("mime_type").get(function () {
  return this.mimeType;
});
AttachmentSchema.virtual("file_name").get(function () {
  return this.fileName;
});
AttachmentSchema.virtual("file_size").get(function () {
  return this.fileSize;
});
AttachmentSchema.virtual("created_at").get(function () {
  return this.createdAt;
});
AttachmentSchema.virtual("updated_at").get(function () {
  return this.updatedAt ? this.updatedAt : this.createdAt;
});

AttachmentSchema.virtual("updated_at").get(function () {
  return this.updatedAt ? this.updatedAt : this.createdAt;
});

AttachmentSchema.virtual("usage").get(function () {
  const parsed = path.parse(this.fileName);
  const isThumbnail =
    parsed.name === "article" &&
    /^\.(jpg|jpeg|png|gif|webp)$/i.test(parsed.ext);
  return isThumbnail ? "article" : "";
});

const ArticleSchema = new Schema(
  {
    attachments: [AttachmentSchema],
    classification: String,
    classification_detail: {
      id: Number,
      document_id: Number,
      cl_by: String,
      cl_reason: String,
      drv_from: String,
      decl_on: String,
      created_at: String,
      updated_at: String,
      classification_xml: String,
      decl_fmt: String,
      title_classif_xml: String,
      summary_classif_xml: String,
    },
    classificationXml: String,
    coauthors: [DissemSchema],
    coordinators: [DissemSchema],
    countries: [DissemSchema],
    createdAt: Date,
    createdBy: {
      id: Number,
      firstName: String,
      lastName: String,
      dn: String,
    },
    datePublished: Date,
    deleted: {
      type: Boolean,
      default: false,
    },
    dissemOrgs: [DissemSchema],
    email_count: {
      type: Number,
      default: 0,
    },
    htmlBody: String,
    images: [],
    issues: [DissemSchema],
    legacyCurrentId: String,
    needed: {},
    nonStateActors: [DissemSchema],
    orgRestricted: Boolean,
    pdfVersionBase64: String,
    pocInfo: String,
    print_count: {
      type: Number,
      default: 0,
    },
    producingOffices: [DissemSchema],
    productNumber: String,
    productType: {
      name: String,
      code: Number,
    },
    publicationDate: Date,
    publicationNumber: String,
    publishedBy: {},
    regions: [DissemSchema],
    reportingType: {
      name: String,
      code: String,
    },
    state: {
      type: String,
      default: "draft",
    },
    subregions: [DissemSchema],
    summary: String,
    summaryClassification: String,
    summaryClassificationXml: String,
    title: String,
    titleClassification: String,
    titleClassificationXml: String,
    thumbnailCaption: String,
    topics: [DissemSchema],
    updatedBy: {
      id: Number,
      firstName: String,
      lastName: String,
      dn: String,
    },
    updatedAt: Date,
    worldwide: Boolean,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ArticleSchema.virtual("features").get(function () {
  return {
    datePublished: this.datePublished,
    createdAt: this.createdAt,
    id: this.get("_id"),
    featureId: this.get("_id"),
    doc_num: this.productNumber,
    images: findArticleImage(this.attachments),
    needed: this.needed,
    orgRestricted: this.orgRestricted,
    nonStateActors: this.nonStateActors,
    productNumber: this.productNumber,
    productType: this.productType,
    state: this.state,
    summary: this.summary,
    summaryClassification: this.summaryClassification,
    title: this.title,
    titleClassification: this.titleClassification,

    // TODO: Once we update the UI to not need the attributes sub-element we can remove the below
    attributes: {
      date_published: this.publicationDate,
      doc_num: this.productNumber,
      feature_id: this.get("_id"),
      id: this.get("_id"),
      images: findArticleImage(this.attachments),
      needed: this.needed?.orgs?.length > 0 ? this.needed : {},
      org_restricted: this.orgRestricted,
      nonStateActors: this.nonStateActors,
      product_type: this.productType.code,
      product_type_name: this.productType.name,
      state: this.state,
      summary: this.summary,
      summary_classification: this.summaryClassification,
      summary_classif: this.summaryClassification,
      title: this.title,
      title_classification: this.titleClassification,
      title_classif: this.titleClassification,
    },
  };
});

ArticleSchema.virtual("forWire").get(function () {
  return {
    datePublished: this.datePublished,
    id: this.get("_id"),
    images: findArticleImage(this.attachments),
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
      date_published: this.publicationDate,
      doc_num: this.productNumber,
      id: this.get("_id"),
      images: findArticleImage(this.attachments),
      needed: this.needed?.orgs?.length > 0 ? this.needed : {},
      org_restricted: this.orgRestricted,
      product_type: this.productType.name,
      state: this.state,
      summary: this.summary,
      summary_classification: this.summaryClassification,
      summary_classif: this.summaryClassification,
      title: this.title,
      title_classification: this.titleClassification,
      title_classif: this.titleClassification,
    },
  };
});

ArticleSchema.virtual("indexable").get(function () {
  return {
    classification: this.classification,
    classificationXml: this.classificationXml,
    countries: this.countries?.map((country) => country.code),
    createdById: this.createdBy?.id,
    datePublished: this.datePublished,
    deleted: this.deleted,
    email_count: this.email_count,
    htmlBody: this.htmlBody,
    id: this.get("_id"),
    featureId: this.get("_id"),
    images: findArticleImage(this.attachments),
    issues: this.issues?.map((issue) => issue.code),
    needed: this.needed || {},
    orgRestricted: this.orgRestricted || false,
    pdfVersionRaw: this.pdfVersionBase64,
    print_count: this.print_count,
    producingOffices: this.producingOffices?.map((office) => office.code),
    productNumber: this.productNumber,
    productType: this.productType?.code,
    regions: this.regions?.map((region) => region.code),
    reportingType: this.reportingType?.code,
    state: this.state,
    subregions: this.subregions?.map((subregion) => subregion.code),
    summary: this.summary,
    summaryClassification: this.summaryClassification,
    title: this.title,
    titleClassification: this.titleClassification,
    topics: this.topics?.map((topic) => topic.code),
    nonStateActors: this.nonStateActors?.map((actor) => actor.code),
    updatedById: this.updatedBy?.id,
    worldwide: this.worldwide,
  };
});

ArticleSchema.virtual("data.document").get(function () {
  return {
    attachments: this.attachments,
    classification: this.classification,
    coauthors: this.coauthors,
    coordinators: this.coordinators,
    countries: this.countries,
    datePublished: this.datePublished,
    dissemOrgs: this.dissemOrgs,
    htmlBody: this.htmlBody,
    id: this.get("_id"),
    issues: this.issues,
    nonStateActors: this.nonStateActors,
    pocInfo: this.pocInfo,
    producingOffices: this.producingOffices,
    productNumber: this.productNumber,
    productType: this.productType,
    publicationDate: this.publicationDate,
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
    thumbnailCaption: this.thumbnailCaption,
    worldwide: this.worldwide,

    // TODO: The following can go away once the UI is updated with the new model/fields
    classification_xml: this.classificationXml,
    date_published: this.publicationDate,
    doc_num: this.productNumber,
    dissem_orgs: this.dissemOrgs,
    non_state_actors: this.nonStateActors,
    html_body: this.htmlBody,
    images: findArticleImage(this.attachments),
    poc_info: this.pocInfo,
    producing_offices: this.producingOffices,
    product_type_id: this.productType.code,
    publication_number: this.publicationNumber,
    summary_classif: this.summaryClassification,
    summary_classif_xml: this.summaryClassificationXml,
    title_classif: this.titleClassification,
    title_classif_xml: this.titleClassificationXml,
    state: this.state,
  };
});

ArticleSchema.virtual("data.details").get(function () {
  return {
    attachments: this.attachments,
    classification: this.classification,
    classification_detail: this.classification_detail,
    coauthors: this.coauthors?.map((author) => author.name), // UI needs a list not the objects right now
    coordinators: this.coordinators?.map((coord) => coord.name), // UI needs a list not the objects right now
    countries: this.countries,
    createdAt: this.createdAt,
    createdBy: this.createdBy,
    datePublished: this.datePublished,
    dissemOrgs: this.dissemOrgs,
    email_count: this.email_count,
    htmlBody: this.htmlBody,
    id: this.get("_id"),
    featureId: this.get("_id"),
    images: findArticleImage(this.attachments),
    issues: this.issues,
    legacyCurrentId: this.legacyCurrentId,
    pocInfo: this.pocInfo,
    print_count: this.print_count,
    producingOffices: this.producingOffices,
    productNumber: this.productNumber,
    productType: this.productType,
    publicationDate: this.publicationDate,
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
    thumbnailCaption: this.thumbnailCaption,
    updatedBy: this.updatedBy,
    worldwide: this.worldwide,

    // TODO: The following can go away once the UI is updated with the new model/fields
    attachments_metadata: this.attachments,
    date_published: this.publicationDate,
    display_date: this.datePublished,
    dissem_orgs: this.dissemOrgs,
    nonStateActors: this.nonStateActors,
    doc_num: this.productNumber,
    document: {
      needed: this.needed,
      org_restricted: this.orgRestricted,
    },
    feature_date: this.datePublished,
    feature_id: this.get("_id"),
    html_body: this.htmlBody,
    legacy: this.legacyCurrentId !== undefined && this.legacyCurrentId !== "",
    poc_info: this.pocInfo,
    posted_at: this.datePublished,
    producing_offices: this.producingOffices,
    product_type_id: this.productType.code,
    product_type_name: this.productType.name,
    published_by: this.publishedBy?.dn,
    title_classif: this.titleClassification,
    updated_by: this.updatedBy,
  };
});

const Article = mongoose.model("Article", ArticleSchema, "articles");

module.exports = Article;
