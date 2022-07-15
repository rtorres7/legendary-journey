
const zelenskyResult = {
  "title": "Inside Zelensky's World",
  "title_classification": "U",
  "summary": "Not sure what really goes here. Investigate.",
  "summary_classification": "U",
  "highlighted_result": '... awake and wonders whether he missed something, forgot someone. “It’s pointless,” Volodymyr \u003cem\u003eZelensky\u003c/em\u003e," told me... "last defenders are besieged. A critical battle has started in the east. Amid all this, \u003cem\u003eZelensky\u003c/em\u003e, the comedian...',
  "doc_num": "BBK303597595551223",
  "id": "87599999",
  "posted_at": "2022-05-02T14:45:58Z",
  "date_published": "2022-05-02",
  "images": {
    "table": {
      "article": null,
      "headline": null,
      "secondary": null,
      "carousel": null
    }
  },
  "needed": {},
  "metadata": [],
  "org_restricted": false
}

const zelenskyArray = () => {
  const array = [];
  for (let i = 0; i < 50; i++) {
    array.push(zelenskyResult)
  }
  return array;
}

export const search = {
  zelensky: {
    aggregations: {
      "reporting_types": {
        "rows": [
          {
            "name": "Reporting: Open Source",
            "key": "reporting.open_source",
            "count": 51
          },
        ],
        "displayName": "Reporting Types"
      },
      "topics": {
        "rows": [
          {
            "name": "Culinary and Tasteful Cooking",
            "key": "CATC",
            "count": 51
          },
        ],
        "displayName": "Topics"
      },
      "countries": {
        "rows": [
          {
            "name": "United Kingdom",
            "key": "GBR",
            "count": 46735
          },
        ],
        "displayName": "Countries"
      },
      "non_state_actors": {
        "rows": [
          {
            "name": "EU",
            "key": "EU",
            "count": 55989
          },
        ],
        "displayName": "Non State Actors"
      },
      "product_types": {
        "rows": [
          {
            "name": "Video",
            "key": 10021,
            "count": 5626
          },
        ],
        "displayName": "Product Types"
      },
      "classification": {
        "rows": [
          {
            "name": "UNCLASSIFIED",
            "key": "UNCLASSIFIED",
            "count": 953520
          },
        ],
        "displayName": "Classification"
      },
      "producing_offices": {
        "rows": [
          {
            "name": "Directorate of Culinary Innovation",
            "key": "Directorate of Culinary Innovation",
            "count": 562587
          },
        ],
        "displayName": "Producing Offices"
      },
      "media_tags": {
        "rows": [
          {
            "name": "graphic",
            "key": "graphic",
            "count": 1284
          },
        ],
        "displayName": "Media Tags"
      }
    },
    pages: 50,
    totalCount: 51,
    results: zelenskyArray(),
    searchId: parseInt('000012345'),
    daClassifError: true,
    siteEnhancement: []
  },
  united_nations: {
    aggregations: {
      "reporting_types": {
        "rows": [
          {
            "name": "Reporting: Open Source",
            "key": "reporting.open_source",
            "count": 953459
          },
        ],
        "displayName": "Reporting Types"
      },
      "topics": {
        "rows": [
          {
            "name": "Culinary and Tasteful Cooking",
            "key": "CATC",
            "count": 499329
          },
        ],
        "displayName": "Topics"
      },
      "countries": {
        "rows": [
          {
            "name": "United Kingdom",
            "key": "GBR",
            "count": 46735
          },
        ],
        "displayName": "Countries"
      },
      "non_state_actors": {
        "rows": [
          {
            "name": "EU",
            "key": "EU",
            "count": 55989
          },
        ],
        "displayName": "Non State Actors"
      },
      "product_types": {
        "rows": [
          {
            "name": "Video",
            "key": 10021,
            "count": 5626
          },
        ],
        "displayName": "Product Types"
      },
      "classification": {
        "rows": [
          {
            "name": "UNCLASSIFIED",
            "key": "UNCLASSIFIED",
            "count": 953520
          },
        ],
        "displayName": "Classification"
      },
      "producing_offices": {
        "rows": [
          {
            "name": "Directorate of Culinary Innovation",
            "key": "Directorate of Culinary Innovation",
            "count": 562587
          },
        ],
        "displayName": "Producing Offices"
      },
      "media_tags": {
        "rows": [
          {
            "name": "graphic",
            "key": "graphic",
            "count": 1284
          },
        ],
        "displayName": "Media Tags"
      }
    },
    pages: 50,
    totalCount: 996870,
    results: [
      {
        "title": "(UNITED NATIONS) Cursed Spatula: Spongebob Squarepants - Bikini Bottom’s Culinary Discourse May 2022: Stabilizing the Krusty Krab",
        "title_classification": "U",
        "summary": "Not sure what really goes here. Investigate on low-side.",
        "summary_classification": "U",
        "highlighted_result": "... 'The expansion of the Krusty Krab over the past 50 years is the reason for the crisis in \u003cem\u003eBikini Bottom\u003c/em\u003e,' the formula... 'The expansion of the Krusty Krab over the past 50 years is the reason for the crisis in \u003cem\u003eBikini Bottom\u003c/em\u003e,' the formula...",
        "doc_num": "BBK303597595551223",
        "id": "87599999",
        "posted_at": "2022-07-05T14:45:58Z",
        "date_published": "2022-07-05",
        "images": {
          "table": {
            "article": null,
            "headline": null,
            "secondary": null,
            "carousel": null
          }
        },
        "needed": {},
        "metadata": [],
        "org_restricted": false
      }
    ],
    searchId: parseInt('000012345'),
    daClassifError: true,
    siteEnhancement: []
  },
  default: {
    aggregations: {
      "reporting_types": {
        "rows": [
          {
            "name": "Reporting: Open Source",
            "key": "reporting.open_source",
            "count": 953459
          },
        ],
        "displayName": "Reporting Types"
      },
      "topics": {
        "rows": [
          {
            "name": "Culinary and Tasteful Cooking",
            "key": "CATC",
            "count": 499329
          },
        ],
        "displayName": "Topics"
      },
      "countries": {
        "rows": [
          {
            "name": "United Kingdom",
            "key": "GBR",
            "count": 46735
          },
        ],
        "displayName": "Countries"
      },
      "non_state_actors": {
        "rows": [
          {
            "name": "EU",
            "key": "EU",
            "count": 55989
          },
        ],
        "displayName": "Non State Actors"
      },
      "product_types": {
        "rows": [
          {
            "name": "Video",
            "key": 10021,
            "count": 5626
          },
        ],
        "displayName": "Product Types"
      },
      "classification": {
        "rows": [
          {
            "name": "UNCLASSIFIED",
            "key": "UNCLASSIFIED",
            "count": 953520
          },
        ],
        "displayName": "Classification"
      },
      "producing_offices": {
        "rows": [
          {
            "name": "Directorate of Culinary Innovation",
            "key": "Directorate of Culinary Innovation",
            "count": 562587
          },
        ],
        "displayName": "Producing Offices"
      },
      "media_tags": {
        "rows": [
          {
            "name": "graphic",
            "key": "graphic",
            "count": 1284
          },
        ],
        "displayName": "Media Tags"
      }
    },
    pages: 50,
    totalCount: 996870,
    results: [
      {
        "title": "DEFAULT - Cursed Spatula: Spongebob Squarepants - Bikini Bottom’s Culinary Discourse May 2022: Stabilizing the Krusty Krab",
        "title_classification": "U",
        "summary": "Not sure what really goes here. Investigate on low-side.",
        "summary_classification": "U",
        "highlighted_result": "... 'The expansion of the Krusty Krab over the past 50 years is the reason for the crisis in \u003cem\u003eBikini Bottom\u003c/em\u003e,' the formula... 'The expansion of the Krusty Krab over the past 50 years is the reason for the crisis in \u003cem\u003eBikini Bottom\u003c/em\u003e,' the formula...",
        "doc_num": "BBK303597595551223",
        "id": "87599999",
        "posted_at": "2022-07-05T14:45:58Z",
        "date_published": "2022-07-05",
        "images": {
          "table": {
            "article": null,
            "headline": null,
            "secondary": null,
            "carousel": null
          }
        },
        "needed": {},
        "metadata": [],
        "org_restricted": false
      }
    ],
    searchId: parseInt('000012345'),
    daClassifError: true,
    siteEnhancement: []
  }
}
