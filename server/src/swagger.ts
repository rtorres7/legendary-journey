const swaggerAutogen = require("swagger-autogen")({ openapi: "3.1.0" });

const doc = {
  info: {
    title: "Maximus API",
  },
  host: "localhost:8443",
  schemes: ["https"],
  basePath: "/api",
  tags: [
    {
      name: "Alerts",
      description: "Alert API",
    },
    {
      name: "Products",
      description: "Product API",
    },
    {
      name: "Auth",
      description: "Authentication API",
    },
    {
      name: "Metadata",
      description: "Metadata API",
    },
    {
      name: "Legacy",
      description: "Legacy API calls",
    },
    {
      name: "Search",
      description: "Search API",
    },
    {
      name: "Workspace",
      description: "Workspace API",
    },
  ],
  components: {
    "@schemas": {
      Alert: {
        type: "object",
        properties: {
          id: {
            type: "number",
          },
        },
      },
      ProductForWire: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          datePublished: {
            type: "string",
            description: "The date the product was published",
          },
          images: {
            type: "array",
            description: "List of images attached to the product",
            items: {
              type: "object",
            },
          },
          featureId: {
            type: "string",
          },
          needed: {
            type: "object",
            description: "What attributes are required for access",
            properties: {
              orgs: {
                type: "array",
                description:
                  "List of organizations needed by the user for access",
                items: {
                  type: "string",
                },
              },
            },
          },
          orgRestricted: {
            type: "boolean",
            description:
              "Indicator if the product is restricted access by organizations",
          },
          productNumber: {
            type: "string",
            description:
              "The unique identifier of the product, sometimes referenced as doc_num",
          },
          productType: {
            type: "object",
            description: "The type of the product",
            properties: {
              name: {
                type: "string",
                description: "The name of the product type",
              },
              code: {
                type: "number",
                description: "The code of the product type",
              },
              publishable: {
                type: "boolean",
                description: "Whether the type is publishable",
              },
            },
          },
          state: {
            type: "string",
            description: "The state of the product",
            enum: ["draft", "submitted", "posted", "staged"],
          },
          summary: {
            type: "string",
            description: "The summary text of the product",
          },
          summaryClassification: {
            type: "string",
            description: "The classification of the summary text",
          },
          title: {
            type: "string",
            description: "The title text of the product",
          },
          titleClassification: {
            type: "string",
            description: "The classification of the title text",
          },
          attributes: {
            type: "object",
            description:
              "Legacy UI fields, all nested properties are available in the root as camelCase",
            deprecated: true,
            properties: {
              date_published: {
                type: "string",
              },
              doc_num: {
                type: "string",
              },
              id: {
                type: "string",
              },
              images: {
                type: "array",
                items: {
                  type: "object",
                },
              },
              needed: {
                type: "object",
                properties: {
                  org_restricted: {
                    type: "boolean",
                  },
                },
              },
              product_type: {
                type: "string",
              },
              state: {
                type: "string",
              },
              summary: {
                type: "string",
              },
              summary_classification: {
                type: "string",
              },
              summary_classif: {
                type: "string",
              },
              title: {
                type: "string",
              },
              title_classification: {
                type: "string",
              },
              title_classif: {
                type: "string",
              },
            },
          },
        },
      },
      Features: {
        type: "object",
        properties: {
          features: {
            type: "array",
            items: {
              $ref: "#/components/schemas/ProductForWire",
            },
          },
        },
      },
      MetadataOrgLookup: {
        type: "object",
        properties: {
          ancestry: {
            type: "string",
          },
          ancestry_depth: {
            type: "number",
          },
          category: {
            type: "string",
          },
          code: {
            type: "string",
          },
          created_at: {
            type: "string",
          },
          description: {
            type: "string",
          },
          id: {
            type: "number",
          },
          label: {
            type: "string",
          },
          legacy: {
            type: "boolean",
          },
          name: {
            type: "string",
          },
          ntk_org: {
            type: "boolean",
          },
          position: {
            type: "number",
          },
          updated_at: {
            type: "string",
          },
          usgov_org: {
            type: "boolean",
          },
          visible: {
            type: "boolean",
          },
        },
      },
      MetadataGenericLookup: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the lookup value",
          },
          code: {
            type: "string",
            description: "The code of the lookup value",
          },
        },
      },
      ProductDetails: {
        allOf: [
          {
            $ref: "#/components/schemas/ProductForWire",
          },
          {
            type: "object",
            properties: {
              attachments: {
                type: "object",
                description: "Metadata about the attachments on the product",
              },
              classification: {
                type: "string",
                description: "The overall classification of the product",
              },
              coauthors: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataOrgLookup",
                },
              },
              coordinators: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataOrgLookup",
                },
              },
              countries: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    code: {
                      type: "string",
                    },
                    diagraph: {
                      type: "string",
                    },
                  },
                },
              },
              dissemOrgs: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataOrgLookup",
                },
              },
              htmlBody: {
                type: "string",
              },
              issues: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataGenericLookup",
                },
              },
              legacyCurrentId: {
                type: "string",
              },
              nonStateActors: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataOrgLookup",
                },
              },
              pocInfo: {
                type: "string",
              },
              producingOffices: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataOrgLookup",
                },
              },
              publicationNumber: {
                type: "string",
              },
              publishedBy: {
                type: "object",
              },
              regions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    code: {
                      type: "string",
                    },
                    subregions: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  },
                },
              },
              subregions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    code: {
                      type: "string",
                    },
                    country_codes: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  },
                },
              },
              summaryClassificationXml: {
                type: "string",
              },
              titleClassificationXml: {
                type: "string",
              },
              topics: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataGenericLookup",
                },
              },
              thumbnailCaption: {
                type: "string",
              },
              worldwide: {
                type: "boolean",
              },
              attachments_metadata: {
                deprecated: true,
                type: "object",
              },
              date_published: {
                deprecated: true,
                type: "string",
              },
              display_date: {
                deprecated: true,
                type: "string",
              },
              dissem_orgs: {
                deprecated: true,
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataOrgLookup",
                },
              },
              doc_num: {
                type: "string",
                deprecated: true,
              },
              document: {
                deprecated: true,
                type: "object",
                properties: {
                  needed: {
                    type: "object",
                    properties: {
                      orgs: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                    },
                  },
                  org_restricted: {
                    type: "boolean",
                  },
                },
              },
              feature_date: {
                deprecated: true,
                type: "string",
              },
              html_body: {
                deprecated: true,
                type: "string",
              },
              legacy: {
                deprecated: true,
                type: "boolean",
              },
              poc_info: {
                deprecated: true,
                type: "string",
              },
              posted_at: {
                deprecated: true,
                type: "string",
              },
              producing_offices: {
                deprecated: true,
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataOrgLookup",
                },
              },
              product_type_id: {
                type: "string",
                deprecated: true,
              },
              product_type_name: {
                type: "string",
                deprecated: true,
              },
              published_by: {
                deprecated: true,
                type: "object",
              },
              title_classif: {
                deprecated: true,
                type: "string",
              },
            },
          },
        ],
      },
      NewProduct: {
        type: "object",
        properties: {
          topics: {
            type: "array",
            description: "List of topic codes",
            items: {
              type: "string",
            },
          },
          producing_office: {
            type: "string",
            description: "Code for the producing office",
          },
          product_type_id: {
            type: "string",
            description: "Code for the product type",
          },
          non_state_actors: {
            type: "array",
            description: "List of non state actor codes",
            items: {
              type: "string",
            },
          },
          date_published: {
            type: "string",
            description: "The date the product is to be published",
          },
          html_body: {
            type: "string",
            description: "The main content of the product",
          },
          publication_number: {
            type: "string",
            description: "The product's publication number",
          },
          summary: {
            type: "string",
            description: "The summary of the product",
          },
          title: {
            type: "string",
            description: "The title of the product",
          },
        },
      },
      ProductDocument: {
        allOf: [
          {
            $ref: "#/components/schemas/ProductForWire",
          },
          {
            type: "object",
            properties: {
              classification: {
                type: "string",
                description: "The overall classification of the product",
              },
              coauthors: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataOrgLookup",
                },
              },
              coordinators: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataOrgLookup",
                },
              },
              countries: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    code: {
                      type: "string",
                    },
                    diagraph: {
                      type: "string",
                    },
                  },
                },
              },
              dissemOrgs: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataOrgLookup",
                },
              },
              htmlBody: {
                type: "string",
              },
              issues: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataGenericLookup",
                },
              },
              nonStateActors: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataOrgLookup",
                },
              },
              pocInfo: {
                type: "string",
              },
              producingOffices: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataOrgLookup",
                },
              },
              publicationNumber: {
                type: "string",
              },
              regions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    code: {
                      type: "string",
                    },
                    subregions: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  },
                },
              },
              subregions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    code: {
                      type: "string",
                    },
                    country_codes: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  },
                },
              },
              summaryClassificationXml: {
                type: "string",
              },
              titleClassificationXml: {
                type: "string",
              },
              topics: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataGenericLookup",
                },
              },
              thumbnailCaption: {
                type: "string",
              },
              worldwide: {
                type: "boolean",
              },
              date_published: {
                deprecated: true,
                type: "string",
              },
              dissem_orgs: {
                deprecated: true,
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataOrgLookup",
                },
              },
              doc_num: {
                type: "string",
                deprecated: true,
              },
              html_body: {
                deprecated: true,
                type: "string",
              },
              poc_info: {
                deprecated: true,
                type: "string",
              },
              producing_offices: {
                deprecated: true,
                type: "array",
                items: {
                  $ref: "#/components/schemas/MetadataOrgLookup",
                },
              },
              product_type_id: {
                type: "string",
                deprecated: true,
              },
              publication_number: {
                type: "string",
                deprecated: true,
              },
              title_classif: {
                deprecated: true,
                type: "string",
              },
            },
          },
        ],
      },
      UpdateProduct: {
        type: "object",
        properties: {
          countries: {
            type: "array",
            description: "List of country codes",
            items: {
              type: "string",
            },
          },
          topics: {
            type: "array",
            description: "List of topic codes",
            items: {
              type: "string",
            },
          },
          producing_offices: {
            type: "array",
            description: "List of office codes",
            items: {
              type: "string",
            },
          },
          coauthors: {
            type: "array",
            description: "List of coauthor codes",
            items: {
              type: "string",
            },
          },
          coordinators: {
            type: "array",
            description: "List of coordinator codes",
            items: {
              type: "string",
            },
          },
          dissem_orgs: {
            type: "array",
            description: "List of dissem org codes",
            items: {
              type: "string",
            },
          },
          product_type_id: {
            type: "string",
            description: "Code for the product type",
          },
          nonStateActors: {
            type: "array",
            description: "List of non state actor codes",
            items: {
              type: "string",
            },
          },
          classification: {
            type: "string",
            description: "The classification of the product",
          },
          date_published: {
            type: "string",
            description: "The date the product is to be published",
          },
          html_body: {
            type: "string",
            description: "The main content of the product",
          },
          poc_info: {
            type: "string",
            description: "The poc information",
          },
          publication_number: {
            type: "string",
            description: "The product's publication number",
          },
          summary: {
            type: "string",
            description: "The summary of the product",
          },
          summary_classif: {
            type: "string",
            description: "The summary classification of the product",
          },
          title: {
            type: "string",
            description: "The title of the product",
          },
          title_classif: {
            type: "string",
            description: "The title classification of the product",
          },
          thumbnailCaption: {
            type: "string",
            description: "The caption for the thumbnail image",
          },
          worldwide: {
            type: "boolean",
            description: "Whether the product should be marked as worldwide",
          },
        },
      },
      FeaturesAndBriefs: {
        type: "object",
        properties: {
          featured: {
            type: "array",
            description:
              "List of products that are to be featured on the home page",
            items: {
              $ref: "#/components/schemas/ProductForWire",
            },
          },
          briefs: {
            type: "array",
            description: "List of products that used for situational awareness",
            items: {
              $ref: "#/components/schemas/ProductForWire",
            },
          },
        },
      },
      User: {
        type: "object",
        properties: {
          email: {
            type: "string",
          },
          fullName: {
            type: "string",
          },
          name: {
            type: "string",
            deprecated: true,
          },
          lastName: {
            type: "string",
          },
          firstName: {
            type: "string",
          },
          userName: {
            type: "string",
          },
          enabled: {
            type: "boolean",
          },
          emailVerified: {
            type: "boolean",
          },
          hasOrg: {
            type: "boolean",
          },
          phone: {
            type: "number",
          },
          dn: {
            type: "string",
          },
          roles: {
            type: "array",
            items: {
              type: "string",
            },
          },
          organizationId: {
            type: "integer",
          },
          authorizations: {
            type: "object",
            properties: {
              canExportZip: {
                type: "boolean",
              },
              canManageRelatedProducts: {
                type: "boolean",
              },
              canUnpublishDocuments: {
                type: "boolean",
              },
              canUpdateAttachments: {
                type: "boolean",
              },
              canManageSelects: {
                type: "boolean",
              },
              canManageFeatures: {
                type: "boolean",
              },
              canManageWire: {
                type: "boolean",
              },
              canPreviewWireSubscriptionEmail: {
                type: "boolean",
              },
              canViewDocumentAdminTools: {
                type: "boolean",
              },
              canManageSpecialEditions: {
                type: "boolean",
              },
            },
          },
        },
      },
      StandardError: {
        type: "object",
        properties: {
          code: {
            type: "number",
            description: "The status code",
          },
          message: {
            type: "string",
            description: "The error message",
          },
          itemId: {
            type: "string",
            description: "An optional id of an item that caused the error",
          },
          fieldName: {
            type: "string",
            description: "An optional field name that caused the error",
          },
        },
      },
      Metadata: {
        type: "object",
        properties: {
          agency: {
            type: "string",
          },
          contactEmail: {
            type: "string",
          },
          featuresAvailable: {
            type: "string",
          },
          highlightsBanner: {
            type: "string",
          },
          highlightsNavHeader: {
            type: "string",
          },
          name: {
            type: "string",
          },
          nonProduction: {
            type: "boolean",
          },
          project: {
            type: "string",
          },
          resourceLinks: {
            type: "array",
            items: {
              type: "string",
            },
          },
          searchFilters: {
            type: "array",
            items: {
              type: "string",
            },
          },
          siteClassification: {
            type: "string",
          },
          siteDefaultTitle: {
            type: "string",
          },
          criteria: {
            type: "object",
            properties: {
              classification: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/MetadataGenericLookup",
                    },
                  },
                },
              },
              coauthors: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/MetadataOrgLookup",
                    },
                  },
                },
              },
              coordinators: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/MetadataOrgLookup",
                    },
                  },
                },
              },
              countries: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        code: {
                          type: "string",
                        },
                        name: {
                          type: "string",
                        },
                        diagraph: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
              },
              domestic_regions: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      type: "object",
                    },
                  },
                },
              },
              fisa_role: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      type: "object",
                    },
                  },
                },
              },
              issues: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                        code: {
                          type: "string",
                        },
                        topics: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string",
                              },
                              codes: {
                                type: "array",
                                items: {
                                  type: "string",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              media_tags: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/MetadataGenericLookup",
                    },
                  },
                },
              },
              non_state_actors: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/MetadataGenericLookup",
                    },
                  },
                },
              },
              producing_offices: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/MetadataOrgLookup",
                    },
                  },
                },
              },
              product_types: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                        code: {
                          type: "number",
                        },
                        publishable: {
                          type: "boolean",
                        },
                      },
                    },
                  },
                },
              },
              regions: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                        code: {
                          type: "string",
                        },
                        subregions: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                },
              },
              reporting_types: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                        code: {
                          type: "string",
                        },
                        productTypes: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                },
              },
              selected_for: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/MetadataGenericLookup",
                    },
                  },
                },
              },
              subregions: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                        code: {
                          type: "string",
                        },
                        country_codes: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                },
              },
              topics: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/MetadataGenericLookup",
                    },
                  },
                },
              },
              dissem_orgs: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                  },
                  values: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/MetadataOrgLookup",
                    },
                  },
                },
              },
            },
          },
        },
      },
      IndexedProduct: {
        type: "object",
        properties: {
          classification: {
            type: "string",
          },
          classificationXml: {
            type: "string",
          },
          countries: {
            type: "array",
            items: {
              type: "string",
            },
          },
          createdById: {
            type: "number",
          },
          datePublished: {
            type: "string",
          },
          date_published: {
            type: "string",
          },
          doc_num: {
            type: "string",
          },
          htmlBody: {
            type: "string",
          },
          html_body: {
            type: "string",
          },
          id: {
            type: "string",
          },
          issues: {
            type: "array",
            items: {
              type: "string",
            },
          },
          featureId: {
            type: "string",
          },
          needed: {
            type: "object",
            properties: {
              orgs: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
          },
          orgRestricted: {
            type: "boolean",
          },
          org_restricted: {
            type: "boolean",
          },
          producingOffices: {
            type: "array",
            items: {
              type: "string",
            },
          },
          productNumber: {
            type: "string",
          },
          productType: {
            type: "string",
          },
          regions: {
            type: "array",
            items: {
              type: "string",
            },
          },
          reportingType: {
            type: "string",
          },
          subregions: {
            type: "array",
            items: {
              type: "string",
            },
          },
          summary: {
            type: "string",
          },
          summaryClassification: {
            type: "string",
          },
          summary_classification: {
            type: "string",
          },
          summary_classif: {
            type: "string",
          },
          title: {
            type: "string",
          },
          titleClassification: {
            type: "string",
          },
          title_classification: {
            type: "string",
          },
          title_classif: {
            type: "string",
          },
          topics: {
            type: "array",
            items: {
              type: "string",
            },
          },
          nonStateActors: {
            type: "array",
            items: {
              type: "string",
            },
          },
          worldwide: {
            type: "boolean",
          },
          highlighted_result: {
            type: "string",
          },
        },
      },
      SearchResults: {
        type: "object",
        properties: {
          searchId: {
            type: "string",
          },
          results: {
            $ref: "#/components/schemas/IndexedProduct",
          },
          aggregations: {
            type: "object",
          },
          pages: {
            type: "number",
          },
          totalCount: {
            type: "number",
          },
          siteEnhancement: {
            type: "string",
          },
          daClassifError: {
            type: "string",
          },
        },
      },
      PageOfProducts: {
        type: "object",
        properties: {
          size: {
            type: "number",
            description: "The page size",
          },
          number: {
            type: "number",
            description: "The page number",
          },
          numberOfElements: {
            type: "number",
            description: "The number of elements on the current page",
          },
          totalPages: {
            type: "number",
            description: "The total number of pages in the results",
          },
          totalElements: {
            type: "number",
            description: "The total number of elements in the result set",
          },
          sort: {
            type: "object",
            properties: {
              direction: {
                type: "string",
              },
              property: {
                type: "string",
              },
              ignoreCase: {
                type: "boolean",
              },
              ascending: {
                type: "boolean",
              },
            },
          },
          pagingStartsWith: {
            type: "number",
            description: "The number that paging starts with (0 or 1)",
          },
          content: {
            type: "array",
            items: {
              $ref: "#/components/schemas/ProductForWire",
            },
          },
        },
      },
      PageOfSavedProducts: {
        type: "object",
        properties: {
          size: {
            type: "number",
            description: "The page size",
          },
          number: {
            type: "number",
            description: "The page number",
          },
          numberOfElements: {
            type: "number",
            description: "The number of elements on the current page",
          },
          totalPages: {
            type: "number",
            description: "The total number of pages in the results",
          },
          totalElements: {
            type: "number",
            description: "The total number of elements in the result set",
          },
          sort: {
            type: "object",
            properties: {
              direction: {
                type: "string",
              },
              property: {
                type: "string",
              },
              ignoreCase: {
                type: "boolean",
              },
              ascending: {
                type: "boolean",
              },
            },
          },
          pagingStartsWith: {
            type: "number",
            description: "The number that paging starts with (0 or 1)",
          },
          supplementaryData: {
            type: "object",
            description: "Contains aggregations for the search",
          },
          content: {
            type: "array",
            items: {
              $ref: "#/components/schemas/IndexedProduct",
            },
          },
        },
      },
      SavedProduct: {
        type: "object",
        properties: {
          id: {
            type: "number",
          },
          createdAt: {
            type: "string",
          },
          productId: {
            type: "string",
          },
          createdBy: {
            type: "number",
          },
        },
      },
      Collection: {
        type: "object",
        properties: {
          id: {
            type: "number",
          },
          createdAt: {
            type: "string",
          },
          updatedAt: {
            type: "string",
          },
          name: {
            type: "string",
          },
          description: {
            type: "string",
          },
          image: {
            type: "string",
          },
          createdBy: {
            type: "number",
          },
        },
      },
      PageOfCollections: {
        type: "object",
        properties: {
          size: {
            type: "number",
            description: "The page size",
          },
          number: {
            type: "number",
            description: "The page number",
          },
          numberOfElements: {
            type: "number",
            description: "The number of elements on the current page",
          },
          totalPages: {
            type: "number",
            description: "The total number of pages in the results",
          },
          totalElements: {
            type: "number",
            description: "The total number of elements in the result set",
          },
          sort: {
            type: "object",
            properties: {
              direction: {
                type: "string",
              },
              property: {
                type: "string",
              },
              ignoreCase: {
                type: "boolean",
              },
              ascending: {
                type: "boolean",
              },
            },
          },
          pagingStartsWith: {
            type: "number",
            description: "The number that paging starts with (0 or 1)",
          },
          content: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Collection",
            },
          },
        },
      },
      NewCollection: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          description: {
            type: "string",
          },
          image: {
            type: "string",
          },
        },
      },
      ListOfSavedProducts: {
        type: "array",
        items: {
          $ref: "#/components/schemas/SavedProduct",
        },
      },
      Feed: {
        type: "object",
        properties: {
          id: {
            type: "number",
          },
          name: {
            type: "string",
          },
          searchParams: {
            type: "string",
          },
          selectedReadings: {
            type: "array",
            items: {
              $ref: "#/components/schemas/SavedProduct",
            },
          },
          state: {
            type: "string",
          },
          order: {
            type: "number",
          },
          classification: {
            type: "string",
          },
        },
      },
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes/*.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./bin/www");
});
