import * as dayjs from "dayjs";

const buildArray = (item, count) => {
  const array = [];
  for (let i = 0; i < count; i++) {
    array.push(item);
  }
  return array;
}

const zelenskyResult = {
  "title": "Inside Zelensky's World",
  "title_classification": "U",
  "summary": "Not sure what really goes here. Investigate.",
  "summary_classification": "U",
  "highlighted_result": '... awake and wonders whether he missed something, forgot someone. “It’s pointless,” Volodymyr \u003cem\u003eZelensky\u003c/em\u003e," told me... "last defenders are besieged. A critical battle has started in the east. Amid all this, \u003cem\u003eZelensky\u003c/em\u003e, the comedian...',
  "doc_num": "BBK303597595551223",
  "id": "87599999",
  "posted_at": "2022-05-02T14:45:58Z",
  "date_published": dayjs("2022-05-02").subtract(1, 'day'),
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
          {
            "name": "Reporting: Mission",
            "key": "reporting.mission",
            "count": 47
          },
          {
            "name": "Reporting: Operations",
            "key": "reporting.operations",
            "count": 35
          },
          {
            "name": "Reporting: Collaboration",
            "key": "reporting.collaboration",
            "count": 15
          },
          {
            "name": "Reporting: Enterprise",
            "key": "reporting.enterprise",
            "count": 9
          },
          {
            "name": "Analysis: Critical",
            "key": "analysis.critical",
            "count": 5
          },
        ],
        "displayName": "Reporting Types"
      },
      "topics": {
        "rows": [
          {
            "name": "Ukraine War Crisis",
            "key": "UWC",
            "count": 51
          },
          {
            "name": "Russian Invasion",
            "key": "RIN",
            "count": 38
          },
          {
            "name": "Economic Turmoil",
            "key": "ECT",
            "count": 15
          },
        ],
        "displayName": "Topics"
      },
      "countries": {
        "rows": [
          {
            "name": "Ukraine",
            "key": "URK",
            "count": 51
          },
          {
            "name": "Russia",
            "key": "RUS",
            "count": 50
          },
          {
            "name": "Belarus",
            "key": "BEL",
            "count": 26
          },
          {
            "name": "Germany",
            "key": "GER",
            "count": 18
          },
          {
            "name": "Finland",
            "key": "FIN",
            "count": 10
          },
          {
            "name": "Hungary",
            "key": "HUN",
            "count": 2
          },
        ],
        "displayName": "Countries"
      },
      "non_state_actors": {
        "rows": [
          {
            "name": "EU",
            "key": "EU",
            "count": 50
          },
          {
            "name": "NATO",
            "key": "NATO",
            "count": 48
          },
          {
            "name": "UN",
            "key": "UN",
            "count": 28
          },
        ],
        "displayName": "Non State Actors"
      },
      "product_types": {
        "rows": [
          {
            "name": "Article",
            "key": 10019,
            "count": 51
          },
          {
            "name": "Video",
            "key": 10021,
            "count": 9
          },
        ],
        "displayName": "Product Types"
      },
      "classification": {
        "rows": [
          {
            "name": "UNCLASSIFIED",
            "key": "UNCLASSIFIED",
            "count": 51
          },
        ],
        "displayName": "Classification"
      },
      "producing_offices": {
        "rows": [
          {
            "name": "Directorate of Foreign Affairs",
            "key": "Directorate of Foreign Affairs",
            "count": 51
          },
          {
            "name": "Directorate of Defense",
            "key": "Directorate of Defense",
            "count": 48
          },
          {
            "name": "Surveillance Office",
            "key": "Surveillance Office",
            "count": 40
          },
          {
            "name": "Office of Command",
            "key": "Office of Command",
            "count": 22
          },
          {
            "name": "Directorate of CounterTerrorism",
            "key": "Directorate of CounterTerrorism",
            "count": 15
          },
          {
            "name": "National Office",
            "key": "National Office",
            "count": 2
          },
        ],
        "displayName": "Producing Offices"
      },
      "media_tags": {
        "rows": [
          {
            "name": "graphic",
            "key": "graphic",
            "count": 25
          },
        ],
        "displayName": "Media Tags"
      }
    },
    pages: 2,
    totalCount: 51,
    results: buildArray(zelenskyResult, 50),
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
  none: {
    aggregations: [],
    pages: 0,
    totalCount: 0,
    results: [],
    searchId: parseInt('000000001'),
    daClassifError: false,
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
