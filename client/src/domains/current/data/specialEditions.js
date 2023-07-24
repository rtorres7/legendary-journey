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

const reporting = {
  date_published: "2022-09-23",
  doc_num: "WIRe001_sample_2",
  featured_timestamp: null,
  id: "24728829",
  publication_type: null,
  posted_at: "2022-09-23T15:26:53Z",
  summary_classification: "U",
  summary_sci: 0,
  title_classification: "U",
  title_sci: 8,
  images: [],
  title: "Questions loom over Ukraine’s counteroffensive in Kharkiv",
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
  name_classification: "U",
  name_classification_xml:
    '<class:Classification xmln:class="urn:us:gov:cia:enterprise:schema:Classification:2.3" xmlns="http://www.w3.org/1999/xhtml" dateClassified"2022-11-09" portionMarking="true" caveat="false" tool="DHTML" toolVersion="202220"><class:ClassificationMarking type="USClassificationMarking" value="U"></class:ClassificationMarking><class:ClassifiedBy></class:ClassifiedBy><class:ClassificationHeader><class:ClassificationBanner>U</class:ClassificationBanner><class:SCICaveat></class:SCICaveat><class:DescriptiveMarkings></class:DescriptiveMarkings></class:ClassificationHeader><class:ClassificationFooter><class:ClassificationBanner>U</class:ClassificationBanner></class:ClassificationFooter></class:Classification>',
  search_params: "http://localhost:8080/#/search?text=russia",
  state: "posted",
  position: 1,
  key_leaders: "",
  key_readings: "WIRe001_sample_1\nWIRe001_sample_2\nWIRe001_sample_3",
  icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAIAAAD+THXTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABqSURBVGhD7c8BDYAwEACxvU6komN2CDZ2S5Ma6JrnvYxSgVKBUoFSgVKBUoFSgVKBUoFSgVKBUoFSgVKBUoFSgVLB+vZcRqlAqUCpQKlAqUCpQKlAqUCpQKlAqUCpQKlAqUCpQKlA6Xx7fuEn7pxwTlEJAAAAAElFTkSuQmCC",
  canEdit: true,
  articles: buildArray(article, 10),
  restrictedArticles: buildArray(restrictedArticle, 4),
  readings: buildArray(reading, 3),
  people: [],
  reporting: [
    {
      type: "Clandestine",
      docs: buildArray(reporting, 3),
    },
    {
      type: "MFAC",
      docs: buildArray(reporting, 3),
    },
    {
      type: "Open Source",
      docs: buildArray(reporting, 3),
    },
    {
      type: "Technical",
      docs: buildArray(reporting, 3),
    },
  ],
};

export const specialEditionLinks = {
  concepts: {
    posted: [
      {
        name: "(U) Russia/Ukraine Tensions",
        image_path: "/special_editions/1/icon",
        id: 1,
      },
      {
        name: "(U) November Elections 2022",
        image_path: "/special_editions/2/icon",
        id: 2,
      },
      {
        name: "(U) Qatar World Cup 2022",
        image_path: "/special_editions/3/icon",
        id: 3,
      },
    ],
    draft: [
      {
        name: "(U) Testing Draft Edition",
        image_path: "/special_editions/4/icon",
        id: 4,
      },
    ],
    archived: [
      {
        name: "(U) Special Editions Archived Test",
        image_path: "/special_editions/5/icon",
        id: 5,
      },
      {
        name: "(U) Syria - CPP:TEST",
        image_path: "/special_editions/6/icon",
        id: 6,
      },
    ],
  },
};
