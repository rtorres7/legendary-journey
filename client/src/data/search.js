import * as dayjs from "dayjs";

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

const chinaResult = {
  "title": "China Restarts Military Drills in Response to Latest U.S. Lawmakers’ Visit to Taiwan",
  "title_classification": "U",
  "summary": "Not sure what really goes here. Investigate.",
  "summary_classification": "U",
  "highlighted_result": '... Defense Ministry in turn condemned \u003cem\u003eChina\u003c/em\u003e’s latest military exercises as “undermining regional peace and stability” in a statement released Monday evening. It said \u003cem\u003eChina\u003c/em\u003e’s military, the People’s Liberation Army, had sent 30 aircraft on sorties near Taiwan, including 15 that crossed ...',
  "doc_num": "BBK303597595551226",
  "id": "87599999",
  "posted_at": "2022-08-17T14:45:58Z",
  "date_published": "2022-08-17",
  "images": {
    "table": {
      "article": null,
      "headline": null,
      "secondary": "british-virgin-islands.png",
      "carousel": null
    }
  },
  "needed": {},
  "metadata": [],
  "org_restricted": false,
  "regions": ["CHN", "TWN"]
}

const russiaResult = {
  "title": "Russia steps up missile strikes on Ukraine as G7 leaders gather",
  "title_classification": "U",
  "summary": "Not sure what really goes here. Investigate.",
  "summary_classification": "U",
  "highlighted_result": '... six wounded. He said explosions heard later in other parts if Kyiv were air defences destroying further incoming missiles. \u003cem\u003eRussia\u003c/em\u003e has stepped up air strikes on Ukraine this weekend, which has also seen the fall of a strategic eastern city to pro-\u003cem\u003eRussia\u003c/em\u003en...',
  "doc_num": "BBK303597595551225",
  "id": "87599999",
  "posted_at": "2022-05-02T14:45:58Z",
  "date_published": "2022-05-02",
  "images": {
    "table": {
      "article": null,
      "headline": null,
      "secondary": "british-virgin-islands.png",
      "carousel": null
    }
  },
  "needed": {},
  "metadata": [],
  "org_restricted": false,
  "regions": ["UKR", "RUS"]
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
      "secondary": "british-virgin-islands.png",
      "carousel": null
    }
  },
  "needed": {},
  "metadata": [],
  "org_restricted": false,
  "regions": ["UKR", "RUS"]
}

const UNResult = {
  "title": "Ukraine war: Hundreds trapped in Mariupol steelworks despite evacuations",
  "title_classification": "U",
  "summary": "Not sure what really goes here. Investigate on low-side.",
  "summary_classification": "U",
  "highlighted_result": "... Those who left Mariupol on Monday were evacuated with the support of the \u003cem\u003eUnited Nations\u003c/em\u003e (UN) and the International Committee of the Red Cross, which organised an official convoy. Russia said some evacuees had been taken to a village controlled by Moscow-backed separatists...",
  "doc_num": "BBK303597595551224",
  "id": "87599999",
  "posted_at": "2022-07-05T14:45:58Z",
  "date_published": "2022-05-02",
  "images": {
    "table": {
      "article": null,
      "headline": null,
      "secondary": "british-virgin-islands.png",
      "carousel": null
    }
  },
  "needed": {},
  "metadata": [],
  "org_restricted": false,
  "regions": ["UKR", "RUS"]
}

const paginatedResults = (results, page, total) => {
  const first = (page - 1) * 50
  if (page === total) {
    return results.slice(first)
  } else {
    return results.slice(first, (page * 50))
  }
}

export const getSearchDataFromUrl = (url, { name, query }) => {
  const page = query.page || 1
  if (name === 'issues') {
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
        "issues": {
          "rows": [
            {
              "name": "Ukraine War",
              "key": "UW",
              "count": 421
            },
            {
              "name": "Russian Invasion",
              "key": "RI",
              "count": 338
            },
            {
              "name": "Economic Turmoil",
              "key": "ET",
              "count": 80
            },
          ],
          "displayName": "Topics"
        },
        "countries": {
          "rows": [
            {
              "name": "Ukraine",
              "key": "UKR",
              "count": 421
            },
            {
              "name": "Russia",
              "key": "RUS",
              "count": 373
            },
            {
              "name": "Belarus",
              "key": "BLR",
              "count": 120
            },
            {
              "name": "Germany",
              "key": "DEU",
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
        "classifications": {
          "rows": [
            {
              "name": "UNCLASSIFIED",
              "key": "UNC",
              "count": 421
            },
          ],
          "displayName": "Classification"
        },
        "producing_offices": {
          "rows": [
            {
              "name": "Directorate of Foreign Affairs",
              "key": "DFA",
              "count": 271
            },
            {
              "name": "Directorate of Defense",
              "key": "DOD",
              "count": 248
            },
            {
              "name": "Surveillance Office",
              "key": "SVO",
              "count": 140
            },
            {
              "name": "Office of Command",
              "key": "OOC",
              "count": 52
            },
            {
              "name": "Directorate of CounterTerrorism",
              "key": "DOC",
              "count": 15
            },
            {
              "name": "National Office",
              "key": "NAO",
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
      results: paginatedResults(buildArray({ ...russiaResult }, 421, query.sort_dir), page, 9),
      searchId: parseInt('000012345'),
      daClassifError: true,
      siteEnhancement: []
    }
  } else if (name === 'regions' || name === 'subregions' || name === 'countries') {
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
        "issues": {
          "rows": [
            {
              "name": "Ukraine War",
              "key": "UW",
              "count": 421
            },
            {
              "name": "Russian Invasion",
              "key": "RI",
              "count": 338
            },
            {
              "name": "Economic Turmoil",
              "key": "ET",
              "count": 80
            },
          ],
          "displayName": "Topics"
        },
        "countries": {
          "rows": [
            {
              "name": "China",
              "key": "CHN",
              "count": 689
            },
            {
              "name": "Russia",
              "key": "RUS",
              "count": 373
            },
            {
              "name": "Belarus",
              "key": "BLR",
              "count": 120
            },
            {
              "name": "Germany",
              "key": "DEU",
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
        "classifications": {
          "rows": [
            {
              "name": "UNCLASSIFIED",
              "key": "UNC",
              "count": 421
            },
          ],
          "displayName": "Classification"
        },
        "producing_offices": {
          "rows": [
            {
              "name": "Directorate of Foreign Affairs",
              "key": "DFA",
              "count": 271
            },
            {
              "name": "Directorate of Defense",
              "key": "DOD",
              "count": 248
            },
            {
              "name": "Surveillance Office",
              "key": "SVO",
              "count": 140
            },
            {
              "name": "Office of Command",
              "key": "OOC",
              "count": 52
            },
            {
              "name": "Directorate of CounterTerrorism",
              "key": "DOC",
              "count": 15
            },
            {
              "name": "National Office",
              "key": "NAO",
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
      results: paginatedResults(buildArray({ ...chinaResult }, 421, query.sort_dir), page, 9),
      searchId: parseInt('000012345'),
      daClassifError: true,
      siteEnhancement: []
    }

  } else {
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
            "issues": {
              "rows": [
                {
                  "name": "Ukraine War",
                  "key": "UW",
                  "count": 421
                },
                {
                  "name": "Russian Invasion",
                  "key": "RI",
                  "count": 338
                },
                {
                  "name": "Economic Turmoil",
                  "key": "ET",
                  "count": 80
                },
              ],
              "displayName": "Topics"
            },
            "countries": {
              "rows": [
                {
                  "name": "Ukraine",
                  "key": "UKR",
                  "count": 421
                },
                {
                  "name": "Russia",
                  "key": "RUS",
                  "count": 373
                },
                {
                  "name": "Belarus",
                  "key": "BLR",
                  "count": 120
                },
                {
                  "name": "Germany",
                  "key": "DEU",
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
            "classifications": {
              "rows": [
                {
                  "name": "UNCLASSIFIED",
                  "key": "UNC",
                  "count": 421
                },
              ],
              "displayName": "Classification"
            },
            "producing_offices": {
              "rows": [
                {
                  "name": "Directorate of Foreign Affairs",
                  "key": "DFA",
                  "count": 271
                },
                {
                  "name": "Directorate of Defense",
                  "key": "DOD",
                  "count": 248
                },
                {
                  "name": "Surveillance Office",
                  "key": "SVO",
                  "count": 140
                },
                {
                  "name": "Office of Command",
                  "key": "OOC",
                  "count": 52
                },
                {
                  "name": "Directorate of CounterTerrorism",
                  "key": "DOC",
                  "count": 15
                },
                {
                  "name": "National Office",
                  "key": "NAO",
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
            "issues": {
              "rows": [
                {
                  "name": "Ukraine War",
                  "key": "UW",
                  "count": 235
                },
                {
                  "name": "Russian Invasion",
                  "key": "RI",
                  "count": 235
                },
                {
                  "name": "Economic Turmoil",
                  "key": "ET",
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
                  "key": "BLR",
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
            "classifications": {
              "rows": [
                {
                  "name": "UNCLASSIFIED",
                  "key": "UNC",
                  "count": 421
                },
              ],
              "displayName": "Classification"
            },
            "producing_offices": {
              "rows": [
                {
                  "name": "Directorate of Foreign Affairs",
                  "key": "DOC",
                  "count": 235
                },
                {
                  "name": "Directorate of Defense",
                  "key": "DOD",
                  "count": 200
                },
                {
                  "name": "Surveillance Office",
                  "key": "SVO",
                  "count": 117
                },
                {
                  "name": "Office of Command",
                  "key": "OOC",
                  "count": 37
                },
                {
                  "name": "Directorate of CounterTerrorism",
                  "key": "DOC",
                  "count": 14
                },
                {
                  "name": "National Office",
                  "key": "NAO",
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

}

export const getOseFeeds = {
  aggregations: {},
  pages: 1,
  totalCount: 4,
  results: [
    {
      "title": "OSE Feed Alert #1 Test This is a Test This is a Test This is a Test This is a Test This is a Test This is a Test This is a Test This is is is is is is a Test Test Test.",
      "title_classification": "U",
      "summary": "This is the summary of the most recent OSE feed alert #1. The following text is sample latin Lorem Ipsum text to fill the available space with test data. Donec in sem elit. Donec at eleifend nisi. Integer accumsan non magna et vulputate. Donec id enim tincidunt, vestibulum urna nec, vulputate velit. Mauris in ex sed mi egestas maximus. Mauris laoreet lectus urna, eget venenatis nibh porttitor varius. Maecenas pulvinar felis id nunc feugiat ornare ut nec nunc. Donec fermentum malesuada luctus. Vestibulum nec orci ligula. Cras ultricies ornare leo eu placerat. Vestibulum interdum gravida varius. Suspendisse sit amet augue aliquam, malesuada nulla eget, aliquam ex.",
      "summary_classification": "U",
      "date_published": "2022-09-29",
    },
    {
      "title": "OSE Feed Alert #2",
      "title_classification": "U",
      "summary": "This is the summary of the most recent OSE feed alert #2. The following text is sample latin Lorem Ipsum text to fill the available space with test data. Donec in sem elit. Donec at eleifend nisi. Integer accumsan non magna et vulputate. Donec id enim tincidunt, vestibulum urna nec, vulputate velit. Mauris in ex sed mi egestas maximus. Mauris laoreet lectus urna, eget venenatis nibh porttitor varius. Maecenas pulvinar felis id nunc feugiat ornare ut nec nunc. Donec fermentum malesuada luctus. Vestibulum nec orci ligula. Cras ultricies ornare leo eu placerat. Vestibulum interdum gravida varius. Suspendisse sit amet augue aliquam, malesuada nulla eget, aliquam ex.",
      "summary_classification": "U",
      "date_published": "2022-09-29",
    },
    {
      "title": "OSE Feed Alert #3",
      "title_classification": "U",
      "summary": "This is the summary of the most recent OSE feed alert #3. The following text is sample latin Lorem Ipsum text to fill the available space with test data. Donec in sem elit. Donec at eleifend nisi. Integer accumsan non magna et vulputate. Donec id enim tincidunt, vestibulum urna nec, vulputate velit. Mauris in ex sed mi egestas maximus. Mauris laoreet lectus urna, eget venenatis nibh porttitor varius. Maecenas pulvinar felis id nunc feugiat ornare ut nec nunc. Donec fermentum malesuada luctus. Vestibulum nec orci ligula. Cras ultricies ornare leo eu placerat. Vestibulum interdum gravida varius. Suspendisse sit amet augue aliquam, malesuada nulla eget, aliquam ex.",
      "summary_classification": "U",
      "date_published": "2022-09-29",
    },
    {
      "title": "OSE Feed Alert #4",
      "title_classification": "U",
      "summary": "This is the summary of the most recent OSE feed alert #4. The following text is sample latin Lorem Ipsum text to fill the available space with test data. Donec in sem elit. Donec at eleifend nisi. Integer accumsan non magna et vulputate. Donec id enim tincidunt, vestibulum urna nec, vulputate velit. Mauris in ex sed mi egestas maximus. Mauris laoreet lectus urna, eget venenatis nibh porttitor varius. Maecenas pulvinar felis id nunc feugiat ornare ut nec nunc. Donec fermentum malesuada luctus. Vestibulum nec orci ligula. Cras ultricies ornare leo eu placerat. Vestibulum interdum gravida varius. Suspendisse sit amet augue aliquam, malesuada nulla eget, aliquam ex.",
      "summary_classification": "U",
      "date_published": "2022-09-29",
    },
  ],
  searchId: parseInt('000012345'),
  daClassifError: true,
  siteEnhancement: []
}


