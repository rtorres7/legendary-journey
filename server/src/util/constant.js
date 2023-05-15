const es_node = "http://elasticsearch:9200";
const indices = [
  {
    index: "products",
    mappings: {
      properties: {
        classification: {
          type: "keyword",
          index: true,
        },
        classification_xml: {
          type: "keyword",
          index: false,
        },
        control_to: {
          type: "keyword",
          index: true,
        },
        countries: {
          type: "keyword",
          index: true,
        },
        date_published: {
          type: "date",
          index: true,
        },
        organizations: {
          type: "object",
          properties: {
            restricted: {
              type: "keyword",
              index: true,
            }
          }
        },
        html_body: {
          type: "text",
          index: true,
        },
        id: {
          type: "keyword",
          index: true,
        },
        non_state_actors: {
          type: "keyword",
          index: true,
        },
        poc_info: {
          type: "text",
          index: true,
        },
        producing_offices: {
          type: "keyword",
          index: true,
        },
        product_type_id: {
          type: "keyword",
          index: true,
        },
        product_type: {
          type: "keyword",
          index: true,
        },
        summary_classif: {
          type: "keyword",
          index: true,
        },
        summary_classif_xml: {
          type: "keyword",
          index: false,
        },
        title_classif: {
          type: "keyword",
          index: true,
        },
        title_classif_xml: {
          type: "keyword",
          index: false,
        },
        topics: {
          type: "keyword",
          index: true,
        },
        worldwide: {
          type: "boolean",
          index: true,
        },
      },
    },
  },
];

module.exports = {
  es_node,
  indices,
};
