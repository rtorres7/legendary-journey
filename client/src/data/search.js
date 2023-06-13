import * as dayjs from "dayjs";

const buildArray = (item, count, sort_dir) => {
  const array = [];
  let date = item.date_published;
  for (let i = 0; i < count; i++) {
    item.date_published = date;
    array.push({ ...item });
    date = dayjs(date).subtract(1, "day").format("YYYY-MM-DD");
  }
  return sort_dir === "asc" ? array.reverse() : array;
};

const chinaResult = {
  title:
    "China Restarts Military Drills in Response to Latest U.S. Lawmakers’ Visit to Taiwan. Taiwan Tensions Escalate as a Result and U.S. is closely watching the situation. Stay tuned to find out more about the tensions that are rising in the continent.",
  title_classification: "U",
  summary:
    "China’s military responded to the surprise arrival in Taiwan of a new delegation of U.S. lawmakers by announcing a resumption of military drills around the island, in the latest flare-up of tensions in the region. The delegation, led by Senate Foreign Relations Committee member Ed Markey (D., Mass.), met with Taiwanese President Tsai Ing-wen on Monday to discuss maintenance of regional stability and deepening U.S.-Taiwan trade, according to Taiwan’s presidential office. The group arrived in Taipei on Sunday without having...",
  summary_classification: "U",
  highlighted_result: "",
  doc_num: "WIRe001_sample_",
  id: "87599999",
  posted_at: "2022-08-17T14:45:58Z",
  date_published: "2022-08-17",
  images: {
    table: {
      product: null,
      headline: null,
      secondary: "british-virgin-islands.png",
      carousel: null,
    },
  },
  needed: {},
  metadata: [],
  org_restricted: false,
  regions: ["CHN", "TWN"],
};

const russiaResult = {
  title: "Russia steps up missile strikes on Ukraine as G7 leaders gather",
  title_classification: "U",
  summary: "Not sure what really goes here. Investigate.",
  summary_classification: "U",
  highlighted_result:
    "... six wounded. He said explosions heard later in other parts if Kyiv were air defences destroying further incoming missiles. \u003cem\u003eRussia\u003c/em\u003e has stepped up air strikes on Ukraine this weekend, which has also seen the fall of a strategic eastern city to pro-\u003cem\u003eRussia\u003c/em\u003en...",
  doc_num: "BBK303597595551225",
  id: "87599999",
  posted_at: "2022-05-02T14:45:58Z",
  date_published: "2022-05-02",
  images: {
    table: {
      product: null,
      headline: null,
      secondary: "british-virgin-islands.png",
      carousel: null,
    },
  },
  needed: {},
  metadata: [],
  org_restricted: false,
  regions: ["UKR", "RUS"],
};

//TODO: Had to change this to WIRE001_sample_ for this to work
const zelenskyResult = {
  title: "Inside Zelensky's World",
  title_classification: "U",
  summary: "Not sure what really goes here. Investigate.",
  summary_classification: "U",
  highlighted_result:
    '... awake and wonders whether he missed something, forgot someone. “It’s pointless,” Volodymyr \u003cem\u003eZelensky\u003c/em\u003e," told me... "last defenders are besieged. A critical battle has started in the east. Amid all this, \u003cem\u003eZelensky\u003c/em\u003e, the comedian...',
  doc_num: "WIRe001_sample_",
  id: "87599999",
  posted_at: "2022-05-02T14:45:58Z",
  date_published: "2022-05-02",
  images: {
    table: {
      product: null,
      headline: null,
      secondary: "british-virgin-islands.png",
      carousel: null,
    },
  },
  needed: {},
  metadata: [],
  org_restricted: false,
  regions: ["UKR", "RUS"],
};

const UNResult = {
  title:
    "Ukraine war: Hundreds trapped in Mariupol steelworks despite evacuations",
  title_classification: "U",
  summary: "Not sure what really goes here. Investigate on low-side.",
  summary_classification: "U",
  highlighted_result:
    "... Those who left Mariupol on Monday were evacuated with the support of the \u003cem\u003eUnited Nations\u003c/em\u003e (UN) and the International Committee of the Red Cross, which organised an official convoy. Russia said some evacuees had been taken to a village controlled by Moscow-backed separatists...",
  doc_num: "BBK303597595551224",
  id: "87599999",
  posted_at: "2022-07-05T14:45:58Z",
  date_published: "2022-05-02",
  images: {
    table: {
      product: null,
      headline: null,
      secondary: "british-virgin-islands.png",
      carousel: null,
    },
  },
  needed: {},
  metadata: [],
  org_restricted: false,
  regions: ["UKR", "RUS"],
};

const paginatedResults = (results, page, total) => {
  const first = (page - 1) * 50;
  if (page === total) {
    return results.slice(first);
  } else {
    return results.slice(first, page * 50);
  }
};

export const getSearchDataFromUrl = (url, { name, query }) => {
  const page = query.page || 1;
  if (name === "issues") {
    return {
      aggregations: {
        reporting_types: {
          rows: [
            {
              name: "Reporting: Open Source",
              key: "reporting.open_source",
              count: 351,
            },
            {
              name: "Reporting: Mission",
              key: "reporting.mission",
              count: 147,
            },
            {
              name: "Reporting: Operations",
              key: "reporting.operations",
              count: 135,
            },
            {
              name: "Reporting: Collaboration",
              key: "reporting.collaboration",
              count: 115,
            },
            {
              name: "Reporting: Enterprise",
              key: "reporting.enterprise",
              count: 95,
            },
            {
              name: "Analysis: Critical",
              key: "analysis.critical",
              count: 8,
            },
          ],
          displayName: "Reporting Types",
        },
        issues: {
          rows: [
            {
              name: "Ukraine War",
              key: "UW",
              count: 421,
            },
            {
              name: "Russian Invasion",
              key: "RI",
              count: 338,
            },
            {
              name: "Economic Turmoil",
              key: "ET",
              count: 80,
            },
          ],
          displayName: "Topics",
        },
        countries: {
          rows: [
            {
              name: "Ukraine",
              key: "UKR",
              count: 421,
            },
            {
              name: "Russia",
              key: "RUS",
              count: 373,
            },
            {
              name: "Belarus",
              key: "BLR",
              count: 120,
            },
            {
              name: "Germany",
              key: "DEU",
              count: 98,
            },
            {
              name: "Finland",
              key: "FIN",
              count: 35,
            },
            {
              name: "Hungary",
              key: "HUN",
              count: 12,
            },
          ],
          displayName: "Countries",
        },
        non_state_actors: {
          rows: [
            {
              name: "EU",
              key: "EU",
              count: 394,
            },
            {
              name: "NATO",
              key: "NATO",
              count: 248,
            },
            {
              name: "UN",
              key: "UN",
              count: 280,
            },
          ],
          displayName: "Non State Actors",
        },
        classifications: {
          rows: [
            {
              name: "UNCLASSIFIED",
              key: "UNC",
              count: 421,
            },
          ],
          displayName: "Classification",
        },
        producing_offices: {
          rows: [
            {
              name: "Directorate of Foreign Affairs",
              key: "DFA",
              count: 271,
            },
            {
              name: "Directorate of Defense",
              key: "DOD",
              count: 248,
            },
            {
              name: "Surveillance Office",
              key: "SVO",
              count: 140,
            },
            {
              name: "Office of Command",
              key: "OOC",
              count: 52,
            },
            {
              name: "Directorate of CounterTerrorism",
              key: "DOC",
              count: 15,
            },
            {
              name: "National Office",
              key: "NAO",
              count: 2,
            },
          ],
          displayName: "Producing Offices",
        },
        media_tags: {
          rows: [
            {
              name: "graphic",
              key: "graphic",
              count: 310,
            },
          ],
          displayName: "Media Tags",
        },
      },
      pages: 9,
      totalCount: 421,
      results: paginatedResults(
        buildArray({ ...russiaResult }, 421, query.sort_dir),
        page,
        9
      ),
      searchId: parseInt("000012345"),
      daClassifError: true,
      siteEnhancement: [],
    };
  } else if (
    name === "regions" ||
    name === "subregions" ||
    name === "countries"
  ) {
    return {
      aggregations: {
        reporting_types: {
          rows: [
            {
              name: "Reporting: Open Source",
              key: "reporting.open_source",
              count: 351,
            },
            {
              name: "Reporting: Mission",
              key: "reporting.mission",
              count: 147,
            },
            {
              name: "Reporting: Operations",
              key: "reporting.operations",
              count: 135,
            },
            {
              name: "Reporting: Collaboration",
              key: "reporting.collaboration",
              count: 115,
            },
            {
              name: "Reporting: Enterprise",
              key: "reporting.enterprise",
              count: 95,
            },
            {
              name: "Analysis: Critical",
              key: "analysis.critical",
              count: 8,
            },
          ],
          displayName: "Reporting Types",
        },
        issues: {
          rows: [
            {
              name: "Ukraine War",
              key: "UW",
              count: 421,
            },
            {
              name: "Russian Invasion",
              key: "RI",
              count: 338,
            },
            {
              name: "Economic Turmoil",
              key: "ET",
              count: 80,
            },
          ],
          displayName: "Topics",
        },
        countries: {
          rows: [
            {
              name: "China",
              key: "CHN",
              count: 689,
            },
            {
              name: "Russia",
              key: "RUS",
              count: 373,
            },
            {
              name: "Belarus",
              key: "BLR",
              count: 120,
            },
            {
              name: "Germany",
              key: "DEU",
              count: 98,
            },
            {
              name: "Finland",
              key: "FIN",
              count: 35,
            },
            {
              name: "Hungary",
              key: "HUN",
              count: 12,
            },
          ],
          displayName: "Countries",
        },
        non_state_actors: {
          rows: [
            {
              name: "EU",
              key: "EU",
              count: 394,
            },
            {
              name: "NATO",
              key: "NATO",
              count: 248,
            },
            {
              name: "UN",
              key: "UN",
              count: 280,
            },
          ],
          displayName: "Non State Actors",
        },
        classifications: {
          rows: [
            {
              name: "UNCLASSIFIED",
              key: "UNC",
              count: 421,
            },
          ],
          displayName: "Classification",
        },
        producing_offices: {
          rows: [
            {
              name: "Directorate of Foreign Affairs",
              key: "DFA",
              count: 271,
            },
            {
              name: "Directorate of Defense",
              key: "DOD",
              count: 248,
            },
            {
              name: "Surveillance Office",
              key: "SVO",
              count: 140,
            },
            {
              name: "Office of Command",
              key: "OOC",
              count: 52,
            },
            {
              name: "Directorate of CounterTerrorism",
              key: "DOC",
              count: 15,
            },
            {
              name: "National Office",
              key: "NAO",
              count: 2,
            },
          ],
          displayName: "Producing Offices",
        },
        media_tags: {
          rows: [
            {
              name: "graphic",
              key: "graphic",
              count: 310,
            },
          ],
          displayName: "Media Tags",
        },
      },
      pages: 9,
      totalCount: 421,
      results: paginatedResults(
        buildArray({ ...chinaResult }, 421, query.sort_dir),
        page,
        9
      ),
      searchId: parseInt("000012345"),
      daClassifError: true,
      siteEnhancement: [],
    };
  } else {
    switch (query.text) {
      case "Zelensky": {
        return {
          aggregations: {
            reporting_types: {
              rows: [
                {
                  name: "Reporting: Open Source",
                  key: "reporting.open_source",
                  count: 351,
                },
                {
                  name: "Reporting: Mission",
                  key: "reporting.mission",
                  count: 147,
                },
                {
                  name: "Reporting: Operations",
                  key: "reporting.operations",
                  count: 135,
                },
                {
                  name: "Reporting: Collaboration",
                  key: "reporting.collaboration",
                  count: 115,
                },
                {
                  name: "Reporting: Enterprise",
                  key: "reporting.enterprise",
                  count: 95,
                },
                {
                  name: "Analysis: Critical",
                  key: "analysis.critical",
                  count: 8,
                },
              ],
              displayName: "Reporting Types",
            },
            issues: {
              rows: [
                {
                  name: "Ukraine War",
                  key: "UW",
                  count: 421,
                },
                {
                  name: "Russian Invasion",
                  key: "RI",
                  count: 338,
                },
                {
                  name: "Economic Turmoil",
                  key: "ET",
                  count: 80,
                },
              ],
              displayName: "Topics",
            },
            countries: {
              rows: [
                {
                  name: "Ukraine",
                  key: "UKR",
                  count: 421,
                },
                {
                  name: "Russia",
                  key: "RUS",
                  count: 373,
                },
                {
                  name: "Belarus",
                  key: "BLR",
                  count: 120,
                },
                {
                  name: "Germany",
                  key: "DEU",
                  count: 98,
                },
                {
                  name: "Finland",
                  key: "FIN",
                  count: 35,
                },
                {
                  name: "Hungary",
                  key: "HUN",
                  count: 12,
                },
              ],
              displayName: "Countries",
            },
            non_state_actors: {
              rows: [
                {
                  name: "EU",
                  key: "EU",
                  count: 394,
                },
                {
                  name: "NATO",
                  key: "NATO",
                  count: 248,
                },
                {
                  name: "UN",
                  key: "UN",
                  count: 280,
                },
              ],
              displayName: "Non State Actors",
            },
            classifications: {
              rows: [
                {
                  name: "UNCLASSIFIED",
                  key: "UNC",
                  count: 421,
                },
              ],
              displayName: "Classification",
            },
            producing_offices: {
              rows: [
                {
                  name: "Directorate of Foreign Affairs",
                  key: "DFA",
                  count: 271,
                },
                {
                  name: "Directorate of Defense",
                  key: "DOD",
                  count: 248,
                },
                {
                  name: "Surveillance Office",
                  key: "SVO",
                  count: 140,
                },
                {
                  name: "Office of Command",
                  key: "OOC",
                  count: 52,
                },
                {
                  name: "Directorate of CounterTerrorism",
                  key: "DOC",
                  count: 15,
                },
                {
                  name: "National Office",
                  key: "NAO",
                  count: 2,
                },
              ],
              displayName: "Producing Offices",
            },
            media_tags: {
              rows: [
                {
                  name: "graphic",
                  key: "graphic",
                  count: 310,
                },
              ],
              displayName: "Media Tags",
            },
          },
          pages: 9,
          totalCount: 421,
          results: paginatedResults(
            buildArray({ ...zelenskyResult }, 421, query.sort_dir),
            page,
            9
          ),
          searchId: parseInt("000012345"),
          daClassifError: true,
          siteEnhancement: [],
        };
      }
      case "United Nations": {
        return {
          aggregations: {
            reporting_types: {
              rows: [
                {
                  name: "Reporting: Open Source",
                  key: "reporting.open_source",
                  count: 225,
                },
                {
                  name: "Reporting: Mission",
                  key: "reporting.mission",
                  count: 122,
                },
                {
                  name: "Reporting: Operations",
                  key: "reporting.operations",
                  count: 135,
                },
                {
                  name: "Analysis: Critical",
                  key: "analysis.critical",
                  count: 18,
                },
              ],
              displayName: "Reporting Types",
            },
            issues: {
              rows: [
                {
                  name: "Ukraine War",
                  key: "UW",
                  count: 235,
                },
                {
                  name: "Russian Invasion",
                  key: "RI",
                  count: 235,
                },
                {
                  name: "Economic Turmoil",
                  key: "ET",
                  count: 115,
                },
              ],
              displayName: "Topics",
            },
            countries: {
              rows: [
                {
                  name: "Ukraine",
                  key: "URK",
                  count: 235,
                },
                {
                  name: "Russia",
                  key: "RUS",
                  count: 235,
                },
                {
                  name: "Belarus",
                  key: "BLR",
                  count: 12,
                },
              ],
              displayName: "Countries",
            },
            non_state_actors: {
              rows: [
                {
                  name: "UN",
                  key: "UN",
                  count: 235,
                },
                {
                  name: "EU",
                  key: "EU",
                  count: 30,
                },
              ],
              displayName: "Non State Actors",
            },
            classifications: {
              rows: [
                {
                  name: "UNCLASSIFIED",
                  key: "UNC",
                  count: 421,
                },
              ],
              displayName: "Classification",
            },
            producing_offices: {
              rows: [
                {
                  name: "Directorate of Foreign Affairs",
                  key: "DOC",
                  count: 235,
                },
                {
                  name: "Directorate of Defense",
                  key: "DOD",
                  count: 200,
                },
                {
                  name: "Surveillance Office",
                  key: "SVO",
                  count: 117,
                },
                {
                  name: "Office of Command",
                  key: "OOC",
                  count: 37,
                },
                {
                  name: "Directorate of CounterTerrorism",
                  key: "DOC",
                  count: 14,
                },
                {
                  name: "National Office",
                  key: "NAO",
                  count: 1,
                },
              ],
              displayName: "Producing Offices",
            },
            media_tags: {
              rows: [
                {
                  name: "graphic",
                  key: "graphic",
                  count: 166,
                },
              ],
              displayName: "Media Tags",
            },
          },
          pages: 5,
          totalCount: 235,
          results: paginatedResults(
            buildArray({ ...UNResult }, 235, query.sort_dir),
            page,
            5
          ),
          searchId: parseInt("000012346"),
          daClassifError: true,
          siteEnhancement: [],
        };
      }
      default: {
        return {
          aggregations: [],
          pages: 0,
          totalCount: 0,
          results: [],
          searchId: parseInt("000000001"),
          daClassifError: false,
          siteEnhancement: [],
        };
      }
    }
  }
};

export const getSitreps = [
  {
    attributes: {
      date_published: "01-02-23",
      doc_num: "WIRe001_sample_",
      product_type_name: "CT Weekly",
      title_classification: "U",
      title: "Russian CT Weekly",
      org_restricted: true,
      needed: { orgs: ["GHI", "PQR"] },
    },
  },
  {
    attributes: {
      date_published: "01-01-23",
      doc_num: "WIRe001_sample_",
      product_type_name: "Daily Brief",
      title_classification: "U",
      title: "Chinese Daily Brief",
      org_restricted: false,
      needed: {},
    },
  },
  {
    attributes: {
      date_published: "12-30-22",
      doc_num: "WIRe001_sample_",
      product_type_name: "Daily Brief",
      title_classification: "U",
      title: "Iranian Daily Brief",
      org_restricted: false,
      needed: {},
    },
  },
];
