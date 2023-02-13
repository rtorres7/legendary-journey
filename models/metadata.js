var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MetadataSchema = new Schema(
  {
    agency: String,
    contactEmail: String,
    criteria: {
      classification: {
        displayName: String,
        values: [
          {
            name: String,
            code: String,
          },
        ],
      },
      countries: {
        displayName: String,
        values: [
          {
            code: String,
            name: String,
            digraph: String,
            topics: [
              {
                name: String,
                codes: [],
              },
            ],
          },
        ],
      },
      domestic_regions: {
        displayName: String,
        values: [],
      },
      fisa_role: {
        displayname: String,
        values: [],
      },
      issues: {
        displayName: String,
        values: [
          {
            name: String,
            code: String,
            topics: [
              {
                name: String,
                codes: [],
              },
            ],
          },
        ],
      },
      media_tags: {
        displayName: String,
        values: [
          {
            name: String,
            code: String,
          },
        ],
      },
      non_state_actors: {
        displayName: String,
        values: [
          {
            name: String,
            code: String,
          },
        ],
      },
      // producing_offices: {
      //   displayName: String,
      //   values: [
      //     String,
      //     [],
      //   ]
      // },
      product_types: {
        displayName: String,
        values: [
          {
            name: String,
            code: Number,
          },
        ],
      },
      regions: {
        displayName: String,
        values: [
          {
            name: String,
            code: String,
            subregions: [],
          },
        ],
      },
      reporting_types: {
        displayName: String,
        values: [
          {
            name: String,
            code: String,
            productTypes: [],
          },
        ],
      },
      selected_for: {
        displayName: String,
        values: [
          {
            name: String,
            code: String,
          },
        ],
      },
      subregions: {
        displayName: String,
        values: [
          {
            name: String,
            code: String,
            country_codes: [],
          },
        ],
      },
      topics: {
        displayName: String,
        values: [
          {
            name: String,
            code: String,
          },
        ],
      },
      dissem_orgs: {
        ancestry: String,
        ancestry_depth: Number,
        category: String,
        code: String,
        created_at: String,
        description: String,
        id: Number,
        label: String,
        legacy: Boolean,
        name: String,
        ntk_org: Boolean,
        position: Number,
        updated_at: String,
        usgov_org: Boolean,
        visible: Boolean,
      },
    },
    featuresAvailable: {},
    highlightsBanner: String,
    highlightsNavHeader: String,
    name: String,
    nonProduction: Boolean,
    project: String,
    resourceLinks: [],
    searchFilters: [],
    siteClassification: String,
    siteDefaultTitle: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

var Metadata = mongoose.model("Metadata", MetadataSchema, "metadata");
module.exports = Metadata;
