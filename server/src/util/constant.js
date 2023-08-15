const EVENT_TYPES = {
  PRODUCT_VIEW: "PRODUCT_VIEW",
  PRODUCT_PRINT: "PRODUCT_PRINT",
  PRODUCT_SAVE: "PRODUCT_SAVE",
};

const indices = [
  {
    index: "products",
    mappings: {
      properties: {
        // Indexed fields
        classification: {
          type: "keyword",
          index: true,
        },
        countries: {
          type: "keyword",
          index: true,
        },
        createdById: {
          type: "keyword",
          index: true,
        },
        datePublished: {
          type: "date",
          index: true,
        },
        htmlBody: {
          type: "text",
          index: true,
        },
        issues: {
          type: "keyword",
          index: true,
        },
        nonStateActors: {
          type: "keyword",
          index: true,
        },
        producingOffices: {
          type: "keyword",
          index: true,
        },
        productType: {
          type: "keyword",
          index: true,
        },
        regions: {
          type: "keyword",
          index: true,
        },
        reportingType: {
          type: "keyword",
          index: true,
        },
        state: {
          type: "keyword",
          index: true,
        },
        subregions: {
          type: "keyword",
          index: true,
        },
        topics: {
          type: "keyword",
          index: true,
        },

        // Stored fields
        classificationXml: {
          type: "keyword",
        },
        images: {
          type: "object",
        },
        needed: {
          type: "object",
        },
        orgRestricted: {
          type: "text",
        },
        pdfVersionAttachmentId: {
          type: "text",
        },
        productNumber: {
          type: "text",
        },
        summary: {
          type: "text",
        },
        summaryClassification: {
          type: "text",
        },
        title: {
          type: "text",
        },
        titleClassification: {
          type: "text",
        },
        worldwide: {
          type: "boolean",
        },
      },
    },
    pipelines: [
      {
        type: "attachment",
        field: "pdfVersionRaw",
        targetField: "pdfVersion",
      },
    ],
  },
  {
    index: "savedproducts",
    mappings: {
      properties: {
        // Indexed fields
        classification: {
          type: "keyword",
          index: true,
        },
        collection: {
          type: "keyword",
          index: true,
        },
        countries: {
          type: "keyword",
          index: true,
        },
        datePublished: {
          type: "date",
          index: true,
        },
        htmlBody: {
          type: "text",
          index: true,
        },
        issues: {
          type: "keyword",
          index: true,
        },
        nonStateActors: {
          type: "keyword",
          index: true,
        },
        productId: {
          type: "keyword",
          index: true,
        },
        producingOffices: {
          type: "keyword",
          index: true,
        },
        productType: {
          type: "keyword",
          index: true,
        },
        regions: {
          type: "keyword",
          index: true,
        },
        reportingType: {
          type: "keyword",
          index: true,
        },
        savedProductUserId: {
          type: "keyword",
          index: true,
        },
        subregions: {
          type: "keyword",
          index: true,
        },
        topics: {
          type: "keyword",
          index: true,
        },

        // Stored properties
        classificationXml: {
          type: "keyword",
        },
        createdById: {
          type: "keyword",
          index: true,
        },
        images: {
          type: "object",
        },
        needed: {
          type: "object",
        },
        orgRestricted: {
          type: "text",
        },
        productNumber: {
          type: "text",
        },
        summary: {
          type: "text",
        },
        summaryClassification: {
          type: "text",
        },
        title: {
          type: "text",
        },
        titleClassification: {
          type: "text",
        },
        worldwide: {
          type: "boolean",
        },
      },
    },
  },
  {
    index: "eventlogs",
    mappings: {
      properties: {
        eventType: {
          type: "keyword",
          index: true,
        },
        productId: {
          type: "keyword",
          index: true,
        },
        userId: {
          type: "keyword",
          index: true,
        },
        organization: {
          properties: {
            id: {
              type: "keyword",
              index: true,
            },
            name: {
              type: "text",
              fields: {
                keyword: {
                  type: "keyword",
                  ignore_above: 256,
                },
              },
            },
          },
        },
        timestamp: {
          type: "date",
          format: "strict_date_optional_time||epoch_millis",
          index: true,
        },
      },
    },
  },
];

module.exports = {
  indices,
  EVENT_TYPES,
};
