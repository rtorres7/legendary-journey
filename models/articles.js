var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema(
  {
    _explanation: String,
    _score: Number,
    analysis_type_id: Number,
    attachments: [],
    attachments_metadata: [],
    authors: [],
    cache_key: String,
    classification: String,
    classification_decl_fmt: String,
    classification_detail: {},
    classification_xml: String,
    coi_level: Number,
    congress: Boolean,
    control_to: [],
    countries: [],
    countries_fn: [],
    created_at: Date,
    created_by_id: String,
    created_on: Date,
    date_published: Date,
    dissem_orgs: [],
    doc_num: String,
    document_type: String,
    email_count: Number,
    feature_date: Date,
    feature_id: Number,
    featured_category: String,
    featured_timestamp: Date,
    fisa_role: String,
    has_attachment: Boolean,
    highlightAttachmentText: String,
    html_body: String,
    image_caption: String,
    images: [],
    issue_names: [],
    issues: [],
    "multimedia?": Boolean,
    non_state_actors: [],
    poa_product: Boolean,
    poc_attrib: String,
    poc_info: String,
    position: Number,
    posted_at: Date,
    posted_on: Date,
    "posted?": Boolean,
    print_count: Number,
    priority_alert: Boolean,
    producer: String,
    producing_office: String,
    product_image: Boolean,
    product_source: String,
    product_type: String,
    product_type_id: Number,
    product_type_name: String,
    publication_date: Date,
    publication_number: String,
    published_by_id: String,
    readership: [
      {
        name: String,
        y: Number,
      },
    ],
    recalled: Boolean,
    region_names: [],
    regions: [],
    reporting_type: String,
    reporting_type_display_name: String,
    reporting_type_value: String,
    restriction: {},
    sources: [],
    "staged?": Boolean,
    state: String,
    subregions: [],
    summary: String,
    summary_classif: String,
    summary_classif_xml: String,
    summary_classification: String,
    summary_sci: Number,
    title: String,
    title_classif: String,
    title_classif_xml: String,
    title_classification: String,
    title_sci: Number,
    to_param: String,
    to_param_feature: String,
    to_param_wire: Date,
    topics: [],
    topics_fn: [],
    type: String,
    uniqueReadership: Number,
    updated_at: Date,
    us_person_info: Boolean,
    worldwide: Boolean,
    xml_schema_ver: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ArticleSchema.virtual("attributes").get(function () {
  return {
    date_published: this.date_published,
    doc_num: this.get("_id"),
    summary: this.summary,
    summary_classification: this.summary_classification,
    title: this.title,
    title_classification: this.title_classification,
  };
});

ArticleSchema.virtual("data.document").get(function () {
  return {
    attachments: this.attachments,
    classification: this.classification,
    classification_decl_fmt: this.classification_decl_fmt,
    classification_xml: this.classification_xml,
    control_to: this.control_to,
    countries: this.countries,
    date_published: this.date_published,
    dissem_orgs: this.dissem_orgs,
    html_body: this.html_body,
    id: this.get("_id"),
    non_state_actors: this.non_state_actors,
    poc_info: this.poc_info,
    product_type_id: this.product_type_id,
    publication_number: this.publication_number,
    summary_classif: this.summary_classif,
    summary_classif_xml: this.summary_classif_xml,
    title_classif: this.title_classif,
    title_classif_xml: this.title_classif_xml,
    topics: this.topics,
    worldwide: this.worldwide,
  };
});

ArticleSchema.virtual("data.details").get(function () {
  return {
    analysis_type_id: this.analysis_type_id,
    attachments_metadata: this.attachments_metadata,
    authors: this.authors,
    classification: this.classification,
    classification_detail: this.classification_detail,
    coi_level: this.coi_level,
    congress: this.congress,
    countries: this.countries,
    countries_fn: this.contries_fn,
    created_at: this.created_at,
    created_by_id: this.created_by_id,
    created_on: this.created_on,
    date_published: this.date_published,
    display_date: this.display_date,
    display_title: this.display_title,
    dissem_orgs: this.dissem_orgs,
    doc_num: this.get("_id"),
    document_type: this.document_type,
    email_count: this.email_count,
    feature_date: this.feature_date,
    feature_id: this.feature_id,
    fisa_role: this.fisa_role,
    has_attachment: this.has_attachment,
    highlightAttachmentText: this.highlightAttachmentText,
    html_body: this.html_body,
    id: this.get("_id"),
    image_caption: this.image_caption,
    multimedia: this.multimedia,
    non_state_actors: this.non_state_actors,
    pdb_conversion: this.pdb_conversion,
    poa_product: this.poa_product,
    poc_attrib: this.poc_attrib,
    poc_info: this.poc_info,
    posted_at: this.posted_at,
    posted_on: this.posted_on,
    print_count: this.print_count,
    priority_alert: this.priority_alert,
    producer: this.producer,
    producing_office: this.producing_office,
    product_image: this.product_image,
    product_source: this.product_source,
    product_type_id: this.product_type_id,
    product_type_name: this.product_type_name,
    publication_number: this.publication_number,
    published_by_id: this.published_by_id,
    recalled: this.recalled,
    reporting_type: this.reporting_type,
    reporting_type_value: this.reporting_type_value,
    sources: this.sources,
    state: this.state,
    summary: this.summary,
    summary_classif: this.summary_classif,
    summary_sci: this.summary_sci,
    title: this.title,
    title_classif: this.title_classif,
    title_sci: this.title_sci,
    topics: this.topics,
    topics_fn: this.topics_fn,
    type: this.type,
    updated_at: this.updated_at,
    us_person_info: this.us_person_info,
    worldwide: this.worldwide,
    xml_schema_ver: this.xml_schema_ver,
  };
});

var Article = mongoose.model("Article", ArticleSchema, "articles");
module.exports = Article;
