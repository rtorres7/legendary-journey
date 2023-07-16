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
];

module.exports = {
  indices,
};
