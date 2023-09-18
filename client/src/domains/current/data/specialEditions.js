const article = {
  date_published: "2022-11-01",
  doc_num: "WIRe001_sample_5",
  featured_timestamp: null,
  id: 24729002,
  publication_type: null,
  posted_at: "2022-11-01T13:16:00Z",
  summary_classification: "U",
  summary_sci: 0,
  title_classification: "U",
  title_sci: 0,
  images: [],
  title: "King Charles III Leads Commemorations for Queen Elizabeth II",
};

const restrictedArticle = {
  date_published: "2020-12-24",
  doc_num: "WIRe001_sample_403",
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
    subregions: ["Asia, East"],
    issues: ["Environment \u0026 Infrastructure"],
  },
};

const reading = {
  date_published: "2016-11-15",
  doc_num: "WIRe001_sample_3",
  featured_timestamp: null,
  id: 21350147,
  publication_type: null,
  posted_at: "2016-11-15T20:16:14.000-05:00",
  summary_classification: null,
  summary_sci: 0,
  title_classification: "U",
  title_sci: 0,
  images: null,
  title: "Russia Strikes Power Plants, Vowing to Counter Ukraine’s Advance",
};

const buildArray = (item, number) => {
  let array = [];
  for (let i = 0; i < number; i++) {
    array.push(item);
  }
  return array;
};

export const specialEdition = {
  id: 1,
  totalPages: 25,
  name: "Russia/Ukraine Tensions",
  classification: "U",
  classificationXML:
    '<class:Classification xmln:class="urn:us:gov:cia:enterprise:schema:Classification:2.3" xmlns="http://www.w3.org/1999/xhtml" dateClassified"2022-11-09" portionMarking="true" caveat="false" tool="DHTML" toolVersion="202220"><class:ClassificationMarking type="USClassificationMarking" value="U"></class:ClassificationMarking><class:ClassifiedBy></class:ClassifiedBy><class:ClassificationHeader><class:ClassificationBanner>U</class:ClassificationBanner><class:SCICaveat></class:SCICaveat><class:DescriptiveMarkings></class:DescriptiveMarkings></class:ClassificationHeader><class:ClassificationFooter><class:ClassificationBanner>U</class:ClassificationBanner></class:ClassificationFooter></class:Classification>',
  searchParams: "http://localhost:8080/#/search?text=russia",
  state: "posted",
  position: 1,
  selectedReadings: "WIRe001_sample_1\nWIRe001_sample_2\nWIRe001_sample_3",
  canEdit: true,
  articles: buildArray(article, 10),
  restrictedArticles: buildArray(restrictedArticle, 4),
  readings: buildArray(reading, 3),
};

export const specialEditionLinks = [
  {
    name: "(U) Russia/Ukraine Tensions",
    state: "Posted",
    id: 1,
  },
  {
    name: "(U) November Elections 2022",
    state: "Posted",
    id: 2,
  },
  {
    name: "(U) Qatar World Cup 2022",
    state: "Posted",
    id: 3,
  },
  {
    name: "(U) Testing Draft Edition",
    state: "Draft",
    id: 4,
  },
  {
    name: "(U) Special Editions Archived Test",
    state: "Archived",
    id: 5,
  },
  {
    name: "(U) Syria - CPP:TEST",
    state: "Draft",
    id: 6,
  },
];
