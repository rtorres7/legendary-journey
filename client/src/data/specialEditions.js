const article = {
  date_published: "2022-11-01",
  doc_num: "WIReWIRe_sample_5",
  featured_timestamp: null,
  id: 24729002,
  publication_type: null,
  posted_at: "2022-11-01T13:16:00Z",
  summary_classification: "U",
  summary_sci: 0,
  title_classification: "U",
  title_sci: 0,
  images: [],
  title: "King Charles III Leads Commemorations for Queen Elizabeth II"
}

const restrictedArticle = {
  date_published: "2020-12-24",
  doc_num: "WIReWIRe_sample_403",
  featured_timestamp: null,
  id: 24698574,
  publication_type: null,
  posted_at: "2020-12-24T05:01:11Z",
  summary_classification: "U",
  summary_sci: 5,
  title_classification: "U",
  title_sci: 0,
  images: [],
  title: "North Korea: Kim Jon Un is still unhappy",
  org_restricted: true,
  needed: {
    subregions: [
      "Asia, East"
    ],
    issues: [
      "Environment \u0026 Infrastructure"
    ]
  }
}

const reading = {
  date_published: "2016-11-15",
  doc_num: "WIReWIRe_sample_3",
  featured_timestamp: null,
  id: 21350147,
  publication_type: null,
  posted_at: "2016-11-15T20:16:14.000-05:00",
  summary_classification: null,
  summary_sci: 0,
  title_classification: "U",
  title_sci: 0,
  images: null,
  title: "Russia Strikes Power Plants, Vowing to Counter Ukraine’s Advance"
}

const reporting = {
  date_published: "2022-09-23",
  doc_num: "WIReWIRe_sample_2",
  featured_timestamp: null,
  id: "24728829",
  publication_type: null,
  posted_at: "2022-09-23T15:26:53Z",
  summary_classification: "U",
  summary_sci: 0,
  title_classification: "U",
  title_sci: 8,
  images: [],
  title: "Questions loom over Ukraine’s counteroffensive in Kharkiv"
}

const buildArray = (item, number) => {
  let array = []
  for (let i = 0; i < number; i++) {
    array.push(item)
  }
  return array
}

export const specialEdition = {
  totalPages: 25,
  name: "Russia/Ukraine Tensions",
  name_classification: "U",
  name_classification_xml: "\u003cclass:Classification xlmns:class\"...",
  search_params: "http://localhost:8080/#/search?text=russia",
  state: "posted",
  position: 1,
  key_leaders: "",
  key_readings: "",
  icon: "data:image/jpg;base64...",
  canEdit: true,
  articles: buildArray(article, 10),
  restrictedArticles: buildArray(restrictedArticle, 4),
  readings: buildArray(reading, 3),
  people: [],
  reporting: [
    {
      type: "Clandestine",
      docs: buildArray(reporting, 3)
    },
    {
      type: "MFAC",
      docs: buildArray(reporting, 3)
    },
    {
      type: "Open Source",
      docs: buildArray(reporting, 3)
    },
    {
      type: "Technical",
      docs: buildArray(reporting, 3)
    }
  ],
}

export const specialEditionLinks = {
  concepts: {
    posted: [

    ],
    draft: [

    ],
    archived: [

    ]
  }
}
