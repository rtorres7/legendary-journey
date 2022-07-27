import * as dayjs from "dayjs";
import { countries } from '@/data'

const buildArray = (item, count, sort_dir) => {
  const array = [];
  let date = item.date_published;
  for (let i = 0; i < count; i++) {
    item.date_published = date;
    array.push({ ...item });
    date = dayjs(date).subtract(1, 'day').format("YYYY-MM-DD");
  }
  return sort_dir === 'asc' ? array.reverse() : array;
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

const UNResult = {
  "title": "Ukraine war: Hundreds trapped in Mariupol steelworks despite evacuations",
  "title_classification": "U",
  "summary": "Not sure what really goes here. Investigate on low-side.",
  "summary_classification": "U",
  "highlighted_result": "... Those who left Mariupol on Monday were evacuated with the support of the \u003cem\u003eUnited Nations\u003c/em\u003e (UN) and the International Committee of the Red Cross, which organised an official convoy. Russia said some evacuees had been taken to a village controlled by Moscow-backed separatists...",
  "doc_num": "BBK303597595551223",
  "id": "87599999",
  "posted_at": "2022-07-05T14:45:58Z",
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

const paginatedResults = (results, page, total) => {
  const first = (page - 1) * 50
  if (page === total) {
    return results.slice(first)
  } else {
    return results.slice(first, (page * 50))
  }
}

export const getSearchDataFromUrl = (url, { query }) => {
  const page = query.page || 1
  switch (query.text) {
    case 'Zelensky': {
      return {
        aggregations: {
          "reporting_types": {
            "rows": [
              {
                "name": "Reporting: Open Source",
                "key": "reporting.open_source",
                "count": 351
              },
              {
                "name": "Reporting: Mission",
                "key": "reporting.mission",
                "count": 147
              },
              {
                "name": "Reporting: Operations",
                "key": "reporting.operations",
                "count": 135
              },
              {
                "name": "Reporting: Collaboration",
                "key": "reporting.collaboration",
                "count": 115
              },
              {
                "name": "Reporting: Enterprise",
                "key": "reporting.enterprise",
                "count": 95
              },
              {
                "name": "Analysis: Critical",
                "key": "analysis.critical",
                "count": 8
              },
            ],
            "displayName": "Reporting Types"
          },
          "topics": {
            "rows": [
              {
                "name": "Ukraine War Crisis",
                "key": "UWC",
                "count": 421
              },
              {
                "name": "Russian Invasion",
                "key": "RIN",
                "count": 338
              },
              {
                "name": "Economic Turmoil",
                "key": "ECT",
                "count": 80
              },
            ],
            "displayName": "Topics"
          },
          "countries": {
            "rows": [
              {
                "name": "Ukraine",
                "key": "URK",
                "count": 421
              },
              {
                "name": "Russia",
                "key": "RUS",
                "count": 373
              },
              {
                "name": "Belarus",
                "key": "BEL",
                "count": 120
              },
              {
                "name": "Germany",
                "key": "GER",
                "count": 98
              },
              {
                "name": "Finland",
                "key": "FIN",
                "count": 35
              },
              {
                "name": "Hungary",
                "key": "HUN",
                "count": 12
              },
            ],
            "displayName": "Countries"
          },
          "non_state_actors": {
            "rows": [
              {
                "name": "EU",
                "key": "EU",
                "count": 394
              },
              {
                "name": "NATO",
                "key": "NATO",
                "count": 248
              },
              {
                "name": "UN",
                "key": "UN",
                "count": 280
              },
            ],
            "displayName": "Non State Actors"
          },
          "product_types": {
            "rows": [
              {
                "name": "Article",
                "key": 10019,
                "count": 421
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
                "count": 421
              },
            ],
            "displayName": "Classification"
          },
          "producing_offices": {
            "rows": [
              {
                "name": "Directorate of Foreign Affairs",
                "key": "Directorate of Foreign Affairs",
                "count": 271
              },
              {
                "name": "Directorate of Defense",
                "key": "Directorate of Defense",
                "count": 248
              },
              {
                "name": "Surveillance Office",
                "key": "Surveillance Office",
                "count": 140
              },
              {
                "name": "Office of Command",
                "key": "Office of Command",
                "count": 52
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
                "count": 310
              },
            ],
            "displayName": "Media Tags"
          }
        },
        pages: 9,
        totalCount: 421,
        results: paginatedResults(buildArray({ ...zelenskyResult }, 421, query.sort_dir), page, 9),
        searchId: parseInt('000012345'),
        daClassifError: true,
        siteEnhancement: []
      }
    }
    case 'United Nations': {
      return {
        aggregations: {
          "reporting_types": {
            "rows": [
              {
                "name": "Reporting: Open Source",
                "key": "reporting.open_source",
                "count": 225
              },
              {
                "name": "Reporting: Mission",
                "key": "reporting.mission",
                "count": 122
              },
              {
                "name": "Reporting: Operations",
                "key": "reporting.operations",
                "count": 135
              },
              {
                "name": "Analysis: Critical",
                "key": "analysis.critical",
                "count": 18
              },
            ],
            "displayName": "Reporting Types"
          },
          "topics": {
            "rows": [
              {
                "name": "Ukraine War Crisis",
                "key": "UWC",
                "count": 235
              },
              {
                "name": "Russian Invasion",
                "key": "RIN",
                "count": 235
              },
              {
                "name": "Economic Turmoil",
                "key": "ECT",
                "count": 115
              },
            ],
            "displayName": "Topics"
          },
          "countries": {
            "rows": [
              {
                "name": "Ukraine",
                "key": "URK",
                "count": 235
              },
              {
                "name": "Russia",
                "key": "RUS",
                "count": 235
              },
              {
                "name": "Belarus",
                "key": "BEL",
                "count": 12
              },
            ],
            "displayName": "Countries"
          },
          "non_state_actors": {
            "rows": [
              {
                "name": "UN",
                "key": "UN",
                "count": 235
              },
              {
                "name": "EU",
                "key": "EU",
                "count": 30
              },
            ],
            "displayName": "Non State Actors"
          },
          "product_types": {
            "rows": [
              {
                "name": "Article",
                "key": 10019,
                "count": 230
              },
              {
                "name": "Audio",
                "key": 10020,
                "count": 77
              },
              {
                "name": "Video",
                "key": 10021,
                "count": 52
              },
            ],
            "displayName": "Product Types"
          },
          "classification": {
            "rows": [
              {
                "name": "UNCLASSIFIED",
                "key": "UNCLASSIFIED",
                "count": 421
              },
            ],
            "displayName": "Classification"
          },
          "producing_offices": {
            "rows": [
              {
                "name": "Directorate of Foreign Affairs",
                "key": "Directorate of Foreign Affairs",
                "count": 235
              },
              {
                "name": "Directorate of Defense",
                "key": "Directorate of Defense",
                "count": 200
              },
              {
                "name": "Surveillance Office",
                "key": "Surveillance Office",
                "count": 117
              },
              {
                "name": "Office of Command",
                "key": "Office of Command",
                "count": 37
              },
              {
                "name": "Directorate of CounterTerrorism",
                "key": "Directorate of CounterTerrorism",
                "count": 14
              },
              {
                "name": "National Office",
                "key": "National Office",
                "count": 1
              },
            ],
            "displayName": "Producing Offices"
          },
          "media_tags": {
            "rows": [
              {
                "name": "graphic",
                "key": "graphic",
                "count": 166
              },
            ],
            "displayName": "Media Tags"
          }
        },
        pages: 5,
        totalCount: 235,
        results: paginatedResults(buildArray({ ...UNResult }, 235, query.sort_dir), page, 5),
        searchId: parseInt('000012346'),
        daClassifError: true,
        siteEnhancement: []
      }
    }
    default: {
      return {
        aggregations: [],
        pages: 0,
        totalCount: 0,
        results: [],
        searchId: parseInt('000000001'),
        daClassifError: false,
        siteEnhancement: []
      }
    }
  }
}

export const getItems = (type) => {
  switch (type) {
    case 'regions': return countries
    case 'issues': return [
      {
        name: 'Eastern Europe Geopolitics'
      },
      {
        name: 'Economic Turmoil'
      },
      {
        name: 'Russian Invasion'
      },
      {
        name: 'Ukraine War Crisis'
      },
      {
        name: 'Ukraine War'
      }
    ]
    case 'reporting': return [
      {
        name: 'Analysis: Critical'
      },
      {
        name: 'Analysis: Live'
      },
      {
        name: 'Reporting: Collaboration'
      },
      {
        name: 'Reporting: Enterprise'
      },
      {
        name: 'Reporting: Mass'
      },
      {
        name: 'Reporting: Mission'
      },
      {
        name: 'Reporting: Open Source'
      },
      {
        name: 'Reporting: Operations'
      },
      {
        name: 'Article'
      },
      {
        name: 'Audio'
      },
      {
        name: 'Translation'
      },
      {
        name: 'Video'
      }
    ]
    case 'classifications': return [
      {
        name: 'UNCLASSIFIED'
      }
    ]
    case 'media': return [
      {
        name: 'audio'
      },
      {
        name: 'interactive'
      },
      {
        name: 'graphic'
      },
      {
        name: 'map'
      },
      {
        name: 'video'
      },
    ]
    case 'non-state': return [
      {
        name: 'EU'
      },
      {
        name: 'NATO'
      },
      {
        name: 'UN'
      },
    ]
    case 'producing': return [
      {
        name: 'Directorate of CounterTerrorism'
      },
      {
        name: 'Directorate of Defense'
      },
      {
        name: 'Directorate of Foreign Affairs'
      },
      {
        name: 'National Office'
      },
      {
        name: 'Office of Command'
      },
      {
        name: 'Surveillance Office'
      },
    ]
    case 'front-page': return [
      {
        name: 'Featured'
      }
    ]
    default:
      return [
        "test item 1",
        "test item 2",
        "test item 3",
        "test item 4",
        "test item 5",
      ];
  }
}


