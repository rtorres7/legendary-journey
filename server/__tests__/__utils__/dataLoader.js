const Article = require("../../src/models/articles");
const Metadata = require("../../src/models/metadata");

const { Client } = require("@elastic/elasticsearch");
const mongoose = require("mongoose");

const { Sequelize } = require("sequelize");

const logger = require("../../src/config/logger");

const articles = [
  new Article({
    classification: "UNC",
    classificationXml: "",
    countries: [
      {
        code: "AFG",
        name: "Afghanistan",
        digraph: "AF",
      },
    ],
    createdAt: new Date("2022-09-01T13:16:43Z"),
    createdBy: {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      dn: 'foo'
    },
    datePublished: new Date("2022-09-01"),
    dissemOrgs: [
      {
        ancestry: "1000",
        ancestry_depth: 1,
        category: "IC",
        code: "BANKING",
        created_at: new Date("2011-07-30T16:38:33.000-04:00"),
        description: "Dept of Banking",
        id: 3,
        label: "Banking",
        legacy: false,
        name: "BANKING",
        ntk_org: true,
        position: 2,
        updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
        usgov_org: true,
        visible: true,
      },
    ],
    htmlBody:
      '<p><span class="portion_marked_field"> (U) </span><i><strong>Both COVID-19 and flu vaccines have been shown to reduce illness, hospitalizations, and deaths.</strong></i><a class="source-reference">[1]</a> As flu season approaches and COVID-19 vaccine recommendations are updated, you might be wondering if you need to wait after getting a flu vaccine before getting a COVID-19 vaccine? The answer is “no!” You can get them both at the same time if you are eligible and the timing works. Experience with other vaccines has shown that immune response (the way our bodies develop protection) and possible side effects are generally the same whether you get one vaccine at a time or two. </p><p><span class="portion_marked_field"> (U) </span>Even though both vaccines can be given at the same visit, you should follow the recommended schedule for either vaccine: If you haven’t gotten your currently recommended doses of COVID-19 vaccine, get them as soon as you can, and ideally get a flu vaccine by the end of October. The same holds true for kids. If your child is eligible, they can get both vaccines at the same time, but don’t delay either vaccination in order to get them both at the same visit. </p><p><span class="portion_marked_field">(U) </span>A recent CDC study suggests people who received a flu vaccine and an mRNA COVID-19 booster at the same time were slightly more likely (8% to 11%) to report reactions like fatigue, headache, and muscle ache than people who received only the COVID-19 booster, but these reactions were mostly mild and resolved quickly. If you have concerns about getting both vaccines at the same time, speak with your healthcare provider. <section class="digression"><div class="digression-content"><p><span class="portion_marked_field"> (U) </span><i>For additional information, please see the wires: </i><p><a href=""><span class="portion_marked_field"> (U) </span><i>Covid: Why you should consider vaccination.</i></a><i> 31 October 2021</i></p><p><a href=""><span class="portion_marked_field"> (U) </span><i>Covid and the flu: is the flu as deadly as Covid19?</i></a> <i> 18 December 2021</i></p></p></div></section></p>',
    _id: "64709619aa530082dd5cc40e",
    images: [],
    issues: [
      {
        name: "Eastern Europe Geopolitics",
        code: "EEG",
      },
    ],
    needed: {},
    nonStateActors: [
      {
        code: "EU",
        name: "EU",
      },
    ],
    orgRestricted: false,
    pocInfo: "(U) Produced by East Asia.",
    producingOffices: [
      {
        name: "EDUCATION",
        code: "EDUCATION",
      },
    ],
    productNumber: "WIReWIRe_sample_1",
    productType: {
      name: "Current",
      code: 10376,
    },
    regions: [
      {
        name: "Asia",
        code: "AS",
      },
    ],
    reportingType: {
      name: "Analysis: All Source",
      code: "analysis.all_source",
    },
    state: "posted",
    subregions: [
      {
        name: "Asia, South",
        code: "ASso",
      },
    ],
    summary:
      "Summary: This is a test summary description of this article. The contents of this article is coming from an article template that's published into our system. The key/value pairs of this article contain many properties that are used to determine the type of article and other valuable metadata that feeds into the rest of the system. Some more text here to keep the summary going for much longer and address concerns with the line clamp plugin for TailwindCSS.",
    summaryClassification: "U",
    summaryClassificationXml: "",
    title:
      "COVID-19: Many people in the United States have some protection, or immunity, against COVID-19 due to vaccination, previous infection, or both. This immunity, combined with the availability of tests and treatments, has greatly reduced the risk of severe illness, hospitalization, and death from COVID-19 for many people.",
    titleClassification: "U",
    titleClassificationXml: "",
    topics: [
      {
        name: "Belarus Relations",
        code: "BRL",
      },
    ],
    updatedAt: new Date("2022-09-01T18:42:30Z"),
    worldwide: false,
  }),
  new Article({
    classification: "S",
    classificationXml: "",
    countries: [
      {
        code: "AFG",
        name: "Afghanistan",
        digraph: "AF",
      },
      {
        code: "CHE",
        name: "Switzerland",
        digraph: "SZ",
      },
    ],
    createdAt: new Date("2022-08-31T13:00:00Z"),
    createdBy: {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      dn: 'foo'
    },
    datePublished: new Date("2022-09-02"),
    dissemOrgs: [
      {
        ancestry: "1000",
        ancestry_depth: 1,
        category: "POLICY",
        code: "ANCESTRY",
        created_at: new Date("2011-07-30T16:38:33.000-04:00"),
        description: "Dept of Ancestry",
        id: 1,
        label: "Ancestry",
        legacy: false,
        name: "ANCESTRY",
        ntk_org: true,
        position: 2,
        updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
        usgov_org: true,
        visible: true,
      },
    ],
    htmlBody: [
      "(U) Kyiv, Ukraine – The speed of the Ukrainian military’s counteroffensive in the eastern Kharkiv region is nothing short of breakneck.",
      "(U) Three dozen towns and villages have been liberated from the Russian forces who fled eastwards and offered little or no resistance, analysts say.",
      "(U) The Russians abandoned next to no artillery or armoured vehicles, and their retreat from the heavily-fortified area did not look like a panicked flight that followed heavy fighting, according to videos from the area and Ukrainian military reports.",
      "(U) There is only one narrow road that connected the de-occupied towns of Kupiansk and Izyum to the Russian border.",
      "(U) But the retreat did not clog it up – and lasted days, not hours, Mitrokhin said.",
      "(U) To him, this signifies a deliberate decision made in the Kremlin to leave the area and use the manpower and weaponry near separatist-controlled areas.",
      "(U) “The Russian Defence Ministry made a decision – that apparently came from the very top – to fully withdraw forces from Kharkiv and to use the available resources to hold on to the positions in Donetsk, and perhaps, the border of Luhansk,” Mitrokhin said.",
      "(U) “The aftertaste is that all of this is but a remake of Russia’s retreat from northern Ukraine in April,” he said.",
      "(U) Moscow called the April retreat from four regions, including Kyiv, a “goodwill gesture,” but Ukrainian officials and analysts said it was caused by grave miscalculations and heavy losses in manpower and military equipment.",
    ].join(""),
    _id: "64709619aa530082dd5cc416",
    images: [],
    issues: [
      {
        name: "Eastern Europe Geopolitics",
        code: "EEG",
      },
      {
        name: "Terrorism and Homeland Security",
        code: "THS",
      },
    ],
    needed: {},
    nonStateActors: [
      {
        code: "EU",
        name: "EU",
      },
      {
        code: "NATO",
        name: "NATO",
      },
    ],
    orgRestricted: false,
    pocInfo: "(U) Produced by Europe.",
    producingOffices: [
      {
        name: "ANCESTRY",
        code: "ANCESTRY",
      },
    ],
    productNumber: "WIReWIRe_sample_2",
    productType: {
      name: "Community Product",
      code: 10378,
    },
    regions: [
      {
        name: "Asia",
        code: "AS",
      },
      {
        name: "Europe",
        code: "EU",
      },
    ],
    reportingType: {
      name: "Analysis: All Source",
      code: "analysis.all_source",
    },
    state: "posted",
    subregions: [
      {
        name: "Asia, South",
        code: "ASso",
      },
      {
        name: "Europe, Central",
        code: "EUce",
      },
    ],
    summary:
      "The Russians abandoned next to no artillery or armoured vehicles, and their retreat from the heavily-fortified area did not look like a panicked flight that followed heavy fighting, according to videos from the area and Ukrainian military reports.",
    summaryClassification: "U",
    summaryClassificationXml: "",
    title: "Questions loom over Ukraine’s counteroffensive in Kharkiv",
    titleClassification: "U",
    titleClassificationXml: "",
    topics: [
      {
        name: "Belarus Relations",
        code: "BRL",
      },
      {
        name: "Terrorism",
        code: "TERR",
      },
    ],
    updatedAt: new Date("2022-09-01T18:42:30Z"),
    worldwide: false,
  }),
  new Article({
    classification: "UNC",
    classificationXml: "",
    countries: [
      {
        code: "CHE",
        name: "Switzerland",
        digraph: "SZ",
      },
    ],
    createdAt: new Date("2022-08-30T13:00:00Z"),
    createdBy: {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      dn: 'foo'
    },
    datePublished: new Date("2022-09-03"),
    dissemOrgs: [
      {
        ancestry: "1000",
        ancestry_depth: 1,
        category: "POLICY",
        code: "COMMERCE",
        created_at: new Date("2011-07-30T16:38:33.000-04:00"),
        description: "Dept of Commerce",
        id: 4,
        label: "Commerce",
        legacy: false,
        name: "COMMERCE",
        ntk_org: true,
        position: 2,
        updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
        usgov_org: true,
        visible: true,
      },
    ],
    htmlBody: [
      "(U) Russia vowed to regain the initiative in its troubled Ukraine offensive, as it hit power plants causing blackouts across the northeast of the country after a lightning advance by Kyiv’s forces that’s reversed Moscow’s gains.",
      "(U) More than 30 settlements, including Kramatorsk and Dnipro, suffered Russian missile and air strikes over the past day, Ukraine’s General Staff said in its regular update on Facebook Monday. Kharkiv, one of at least two power plants struck by rockets, had power restored only to lose it again later on Monday after being repeatedly shelled, Interfax-Ukraine reported, citing the city’s mayor.",
      "(U) President Vladimir Putin’s spokesman, Dmitry Peskov, said Russia will not settle for anything less than victory in its invasion of the neighboring state, now in its 29th week. Still, the losses mark a major and unexpected strategic setback in Ukraine that could potentially mark a turning-point in the conflict, said two people close to the Defense Ministry and security services in Moscow.",
      "(U) The U.S. ambassador to Ukraine, Bridget Brink, accused Russia in a tweet late on Sunday of “sending missiles to attempt to destroy critical civilian infrastructure,” in an apparent response to Kyiv’s liberation of territory that had been occupied by Russian forces.",
      "(U) The strikes hint at efforts to retaliate after a sudden breakthrough by Ukraine that sent Russian troops fleeing and put Moscow on the defensive. Ukraine’s top commander said that 3,000 square kilometers (1,158 square miles) of lost territory have been returned to Kyiv’s control since the beginning of September.",
      "(U) Peskov brushed off concerns over the hasty retreat in the northeast as Putin presided over a government meeting in Moscow at which he assured that the economy is returning to normal and has repelled the western sanctions imposed over the war. Chechen strongman Ramzan Kadyrov announced that he was sending a new detachment to fight in Ukraine.",
      "(U) But with a lack of manpower and rapidly depleting equipment likely to become a growing concern for Russia’s forces, the risk is that Ukraine could try to cut off the Kremlin’s overstretched forces in the south and threaten Crimea, the person close to the Defense Ministry said.",
    ].join(""),
    _id: "64709619aa530082dd5cc423",
    images: [],
    issues: [
      {
        name: "Eastern Europe Geopolitics",
        code: "EEG",
      },
    ],
    needed: {},
    orgRestricted: false,
    pocInfo: "(U) Produced by Europe.",
    producingOffices: [
      {
        name: "ANCESTRY",
        code: "ANCESTRY",
      },
    ],
    productNumber: "WIReWIRe_sample_3",
    productType: {
      name: "Current",
      code: 10376,
    },
    regions: [
      {
        name: "Europe",
        code: "EU",
      },
    ],
    reportingType: {
      name: "Analysis: All Source",
      code: "analysis.all_source",
    },
    state: "posted",
    subregions: [
      {
        name: "Europe, Central",
        code: "EUce",
      },
    ],
    summary:
      "Russia vowed to regain the initiative in its troubled Ukraine offensive, as it hit power plants causing blackouts across the northeast of the country after a lightning advance by Kyiv’s forces that’s reversed Moscow’s gains.",
    summaryClassification: "U",
    summaryClassificationXml: "",
    title: "Russia Strikes Power Plants, Vowing to Counter Ukraine’s Advance",
    titleClassification: "U",
    titleClassificationXml: "",
    topics: [
      {
        name: "Belarus Relations",
        code: "BRL",
      },
    ],
    updatedAt: new Date("2022-09-01T18:42:30Z"),
    worldwide: true,
  }),
  new Article({
    classification: "UNC",
    classificationXml: "",
    countries: [
      {
        code: "CHE",
        name: "Switzerland",
        digraph: "SZ",
      },
    ],
    createdAt: new Date("2022-08-29T13:00:00Z"),
    createdBy: {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      dn: 'foo'
    },
    datePublished: new Date("2022-09-04"),
    dissemOrgs: [],
    htmlBody: [
      "(U) Both COVID-19 and flu vaccines have been shown to reduce illness, hospitalizations, and deaths. As flu season approaches and COVID-19 vaccine recommendations are updated, you might be wondering if you need to wait after getting a flu vaccine before getting a COVID-19 vaccine? The answer is “no!” You can get them both at the same time if you are eligible and the timing works. Experience with other vaccines has shown that immune response (the way our bodies develop protection) and possible side effects are generally the same whether you get one vaccine at a time or two.",
      "(U) Even though both vaccines can be given at the same visit, you should follow the recommended schedule for either vaccine: If you haven’t gotten your currently recommended doses of COVID-19 vaccine, get them as soon as you can, and ideally get a flu vaccine by the end of October. The same holds true for kids. If your child is eligible, they can get both vaccines at the same time, but don’t delay either vaccination in order to get them both at the same visit.",
      "(U) A recent CDC study suggests people who received a flu vaccine and an mRNA COVID-19 booster at the same time were slightly more likely (8% to 11%) to report reactions like fatigue, headache, and muscle ache than people who received only the COVID-19 booster, but these reactions were mostly mild and resolved quickly. If you have concerns about getting both vaccines at the same time, speak with your healthcare provider.",
    ].join(""),
    _id: "64709619aa530082dd5cc42b",
    images: [],
    issues: [
      {
        name: "Eastern Europe Geopolitics",
        code: "EEG",
      },
    ],
    needed: {},
    orgRestricted: false,
    pocInfo: "(U) Produced by Europe.",
    producingOffices: [
      {
        name: "AGRICULTURE",
        code: "AGRICULTURE",
      },
    ],
    productNumber: "WIReWIRe_sample_4",
    productType: {
      name: "Current",
      code: 10376,
    },
    regions: [
      {
        name: "Europe",
        code: "EU",
      },
    ],
    reportingType: {
      name: "Analysis: All Source",
      code: "analysis.all_source",
    },
    state: "posted",
    subregions: [
      {
        name: "Europe, Central",
        code: "EUce",
      },
    ],
    summary:
      "Summary: There isn't any major update regarding covid numbers in today's report.",
    summaryClassification: "U",
    summaryClassificationXml: "",
    title: "Worldwide: COVID-19 Update as of 14 November",
    titleClassification: "U",
    titleClassificationXml: "",
    topics: [
      {
        name: "Belarus Relations",
        code: "BRL",
      },
    ],
    updatedAt: new Date("2022-09-01T18:42:30Z"),
    worldwide: true,
  }),
  new Article({
    classification: "UNC",
    classificationXml: "",
    countries: [],
    createdAt: new Date("2022-08-28T13:00:00Z"),
    createdBy: {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      dn: 'foo'
    },
    datePublished: new Date("2022-09-05"),
    dissemOrgs: [],
    htmlBody: [
      "(U) Britain's King Charles III made his first speech as monarch to the British parliament on Monday before traveling to Scotland to lead the procession of his mother's coffin.",
      "(U) Charles gave the speech from Westminster Hall in London in a traditional ceremony in which lawmakers expressed their condolences upon the death of Queen Elizabeth II. She died Thursday at age 96.",
      '(U) "As I stand before you today, I cannot help but feel the weight of history which surrounds us, and which reminds us of the vital parliamentary traditions to which members of both houses dedicate yourselves with such personal commitment to the betterment of us all," Charles III said.',
    ].join(),
    _id: "64709619aa530082dd5cc432",
    images: [],
    issues: [
      {
        name: "Eastern Europe Geopolitics",
        code: "EEG",
      },
    ],
    needed: {},
    orgRestricted: false,
    pocInfo: "(U) Produced by Europe.",
    producingOffices: [
      {
        name: "COMMERCE",
        code: "COMMERCE",
      },
    ],
    productNumber: "WIReWIRe_sample_5",
    productType: {
      name: "CT Digest",
      code: 10379,
    },
    regions: [],
    reportingType: {
      name: "Analysis: All Source",
      code: "analysis.all_source",
    },
    state: "draft",
    subregions: [],
    summary:
      "Events to commemorate Queen Elizabeth II are continuing across the U.K. this week, after King Charles III was proclaimed monarch at a ceremony in London over the weekend. King Charles III visited Parliament on Monday, where he made his first address there as monarch and lawmakers expressed their condolences for the death of his mother, before flying with the queen consort to Edinburgh. That the King has chosen to begin his reign with visits to Edinburgh, Belfast and Cardiff is telling. It suggests that the future of the Union is at the heart of his concerns. The early decades of his late mother's reign were characterised by the long, slow contraction of British Imperial power around the world. He will be alert to the possibility that his own reign could come to be defined by the continuation of that process here - and the eventual dissolution of the United Kingdom itself.",
    summaryClassification: "U",
    summaryClassificationXml: "",
    title: "King Charles III Leads Commemorations for Queen Elizabeth II",
    titleClassification: "U",
    titleClassificationXml: "",
    topics: [
      {
        name: "Belarus Relations",
        code: "BRL",
      },
    ],
    updatedAt: new Date("2022-09-01T18:42:30Z"),
    worldwide: true,
  }),
];

const metadata = new Metadata({
  agency: "",
  contactEmail: "",
  criteria: {
    classification: {
      displayName: "Classification",
      values: [
        {
          name: "UNCLASSIFIED",
          code: "UNC",
        },
      ],
    },
    coauthors: {
      displayName: "Coauthors",
      values: [
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "ANCESTRY",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Ancestry",
          id: 1,
          label: "Ancestry",
          legacy: false,
          name: "ANCESTRY",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "IC",
          code: "AGRICULTURE",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Agriculture",
          id: 2,
          label: "Agriculture",
          legacy: false,
          name: "AGRICULTURE",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "IC",
          code: "BANKING",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Banking",
          id: 3,
          label: "Banking",
          legacy: false,
          name: "BANKING",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "COMMERCE",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Commerce",
          id: 4,
          label: "Commerce",
          legacy: false,
          name: "COMMERCE",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "EDUCATION",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Education",
          id: 5,
          label: "Education",
          legacy: false,
          name: "EDUCATION",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "TREASURY",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Treasury",
          id: 6,
          label: "Treasury",
          legacy: false,
          name: "TREASURY",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
      ],
    },
    coordinators: {
      displayName: "Coordinators",
      values: [
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "ANCESTRY",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Ancestry",
          id: 1,
          label: "Ancestry",
          legacy: false,
          name: "ANCESTRY",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "IC",
          code: "AGRICULTURE",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Agriculture",
          id: 2,
          label: "Agriculture",
          legacy: false,
          name: "AGRICULTURE",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "IC",
          code: "BANKING",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Banking",
          id: 3,
          label: "Banking",
          legacy: false,
          name: "BANKING",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "COMMERCE",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Commerce",
          id: 4,
          label: "Commerce",
          legacy: false,
          name: "COMMERCE",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "EDUCATION",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Education",
          id: 5,
          label: "Education",
          legacy: false,
          name: "EDUCATION",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "TREASURY",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Treasury",
          id: 6,
          label: "Treasury",
          legacy: false,
          name: "TREASURY",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
      ],
    },
    countries: {
      displayName: "Countries",
      values: [
        {
          code: "AFG",
          name: "Afghanistan",
          digraph: "AF",
        },
        {
          code: "ALA",
          name: "Aland Islands",
        },
        {
          code: "ALB",
          name: "Albania",
          digraph: "AL",
        },
        {
          code: "DZA",
          name: "Algeria",
          digraph: "AG",
        },
        {
          code: "AND",
          name: "Andorra",
          digraph: "AN",
        },
        {
          code: "AGO",
          name: "Angola",
          digraph: "AO",
        },
        {
          code: "AIA",
          name: "Anguilla",
          digraph: "AV",
        },
        {
          code: "ATA",
          name: "Antarctica",
          digraph: "AY",
        },
        {
          code: "ATG",
          name: "Antigua and Barbuda",
          digraph: "AC",
        },
        {
          code: "ARG",
          name: "Argentina",
          digraph: "AR",
        },
        {
          code: "ARM",
          name: "Armenia",
          digraph: "AM",
        },
        {
          code: "ABW",
          name: "Aruba",
          digraph: "AA",
        },
        {
          code: "AUS",
          name: "Australia",
          digraph: "AS",
        },
        {
          code: "AUT",
          name: "Austria",
          digraph: "AU",
        },
        {
          code: "AZE",
          name: "Azerbaijan",
          digraph: "AJ",
        },
        {
          code: "BHS",
          name: "Bahamas, The",
          digraph: "BF",
        },
        {
          code: "BHR",
          name: "Bahrain",
          digraph: "BA",
        },
        {
          code: "BGD",
          name: "Bangladesh",
          digraph: "BG",
        },
        {
          code: "BRB",
          name: "Barbados",
          digraph: "BB",
        },
        {
          code: "BLR",
          name: "Belarus",
          digraph: "BO",
        },
        {
          code: "BEL",
          name: "Belgium",
          digraph: "BE",
        },
        {
          code: "BLZ",
          name: "Belize",
          digraph: "BH",
        },
        {
          code: "BEN",
          name: "Benin",
          digraph: "BN",
        },
        {
          code: "BMU",
          name: "Bermuda",
          digraph: "BD",
        },
        {
          code: "BTN",
          name: "Bhutan",
          digraph: "BT",
        },
        {
          code: "BOL",
          name: "Bolivia",
          digraph: "BL",
        },
        {
          code: "BES",
          name: "Bonaire, Sint Eustatius, and Saba",
        },
        {
          code: "BIH",
          name: "Bosnia and Herzegovina",
          digraph: "BK",
        },
        {
          code: "BWA",
          name: "Botswana",
          digraph: "BC",
        },
        {
          code: "BVT",
          name: "Bouvet Island",
          digraph: "BV",
        },
        {
          code: "BRA",
          name: "Brazil",
          digraph: "BR",
        },
        {
          code: "IOT",
          name: "British Indian Ocean Territory",
          digraph: "IO",
        },
        {
          code: "VGB",
          name: "British Virgin Islands",
          digraph: "VI",
        },
        {
          code: "BRN",
          name: "Brunei",
          digraph: "BX",
        },
        {
          code: "BGR",
          name: "Bulgaria",
          digraph: "BU",
        },
        {
          code: "BFA",
          name: "Burkina Faso",
          digraph: "UV",
        },
        {
          code: "MMR",
          name: "Burma",
          digraph: "BM",
        },
        {
          code: "BDI",
          name: "Burundi",
          digraph: "BY",
        },
        {
          code: "CPV",
          name: "Cabo Verde",
          digraph: "CV",
        },
        {
          code: "KHM",
          name: "Cambodia",
          digraph: "CB",
        },
        {
          code: "CMR",
          name: "Cameroon",
          digraph: "CM",
        },
        {
          code: "CAN",
          name: "Canada",
          digraph: "CA",
        },
        {
          code: "CYM",
          name: "Cayman Islands",
          digraph: "CJ",
        },
        {
          code: "CAF",
          name: "Central African Republic",
          digraph: "CT",
        },
        {
          code: "TCD",
          name: "Chad",
          digraph: "CD",
        },
        {
          code: "CHL",
          name: "Chile",
          digraph: "CI",
        },
        {
          code: "CHN",
          name: "China",
          digraph: "CH",
        },
        {
          code: "CXR",
          name: "Christmas Island",
          digraph: "KT",
        },
        {
          code: "CCK",
          name: "Cocos (Keeling) Islands",
          digraph: "CK",
        },
        {
          code: "COL",
          name: "Colombia",
          digraph: "CO",
        },
        {
          code: "COM",
          name: "Comoros",
          digraph: "CN",
        },
        {
          code: "COD",
          name: "Democratic Republic of Congo",
          digraph: "CG",
        },
        {
          code: "COG",
          name: "Republic of Congo",
          digraph: "CF",
        },
        {
          code: "COK",
          name: "Cook Islands",
          digraph: "CW",
        },
        {
          code: "CRI",
          name: "Costa Rica",
          digraph: "CS",
        },
        {
          code: "CIV",
          name: "Côte d'Ivoire",
          digraph: "IV",
        },
        {
          code: "HRV",
          name: "Croatia",
          digraph: "HR",
        },
        {
          code: "CUB",
          name: "Cuba",
          digraph: "CU",
        },
        {
          code: "CUW",
          name: "Curacao",
          digraph: "CC",
        },
        {
          code: "CYP",
          name: "Cyprus",
          digraph: "CY",
        },
        {
          code: "CZE",
          name: "Czechia",
          digraph: "EZ",
        },
        {
          code: "DNK",
          name: "Denmark",
          digraph: "DA",
        },
        {
          code: "DJI",
          name: "Djibouti",
          digraph: "DJ",
        },
        {
          code: "DMA",
          name: "Dominica",
          digraph: "DO",
        },
        {
          code: "DOM",
          name: "Dominican Republic",
          digraph: "DR",
        },
        {
          code: "ECU",
          name: "Ecuador",
          digraph: "EC",
        },
        {
          code: "EGY",
          name: "Egypt",
          digraph: "EG",
        },
        {
          code: "SLV",
          name: "El Salvador",
          digraph: "ES",
        },
        {
          code: "GNQ",
          name: "Equatorial Guinea",
          digraph: "EK",
        },
        {
          code: "ERI",
          name: "Eritrea",
          digraph: "ER",
        },
        {
          code: "EST",
          name: "Estonia",
          digraph: "EN",
        },
        {
          code: "SWZ",
          name: "Eswatini",
          digraph: "WZ",
        },
        {
          code: "ETH",
          name: "Ethiopia",
          digraph: "ET",
        },
        {
          code: "FLK",
          name: "Falkland Islands",
          digraph: "FK",
        },
        {
          code: "FRO",
          name: "Faroe Islands",
          digraph: "FO",
        },
        {
          code: "FSM",
          name: "Federated States of Micronesia",
          digraph: "FM",
        },
        {
          code: "FJI",
          name: "Fiji",
          digraph: "FJ",
        },
        {
          code: "FIN",
          name: "Finland",
          digraph: "FI",
        },
        {
          code: "FRA",
          name: "France",
          digraph: "FR",
        },
        {
          code: "GUF",
          name: "French Guiana",
          digraph: "FG",
        },
        {
          code: "PYF",
          name: "French Polynesia",
          digraph: "FP",
        },
        {
          code: "ATF",
          name: "French Southern and Antarctic Lands",
          digraph: "FS",
        },
        {
          code: "GAB",
          name: "Gabon",
          digraph: "GB",
        },
        {
          code: "GMB",
          name: "Gambia, The",
          digraph: "GA",
        },
        {
          code: "GZ",
          name: "Gaza Strip",
          digraph: "GZ",
        },
        {
          code: "GEO",
          name: "Georgia",
          digraph: "GG",
        },
        {
          code: "DEU",
          name: "Germany",
          digraph: "GM",
        },
        {
          code: "GHA",
          name: "Ghana",
          digraph: "GH",
        },
        {
          code: "GIB",
          name: "Gibraltar",
          digraph: "GI",
        },
        {
          code: "GRC",
          name: "Greece",
          digraph: "GR",
        },
        {
          code: "GRL",
          name: "Greenland",
          digraph: "GL",
        },
        {
          code: "GRD",
          name: "Grenada",
          digraph: "GJ",
        },
        {
          code: "GLP",
          name: "Guadeloupe",
          digraph: "GP",
        },
        {
          code: "GTM",
          name: "Guatemala",
          digraph: "GT",
        },
        {
          code: "GGY",
          name: "Guernsey",
          digraph: "GK",
        },
        {
          code: "GIN",
          name: "Guinea",
          digraph: "GV",
        },
        {
          code: "GNB",
          name: "Guinea-Bissau",
          digraph: "PU",
        },
        {
          code: "GUY",
          name: "Guyana",
          digraph: "GY",
        },
        {
          code: "HTI",
          name: "Haiti",
          digraph: "HA",
        },
        {
          code: "HMD",
          name: "Heard Island and McDonald Islands",
          digraph: "HM",
        },
        {
          code: "VAT",
          name: "Holy See (Vatican City)",
          digraph: "VT",
        },
        {
          code: "HND",
          name: "Honduras",
          digraph: "HO",
        },
        {
          code: "HKG",
          name: "Hong Kong",
          digraph: "HK",
        },
        {
          code: "HUN",
          name: "Hungary",
          digraph: "HU",
        },
        {
          code: "ISL",
          name: "Iceland",
          digraph: "IC",
        },
        {
          code: "IND",
          name: "India",
          digraph: "IN",
        },
        {
          code: "IDN",
          name: "Indonesia",
          digraph: "ID",
        },
        {
          code: "IRN",
          name: "Iran",
          digraph: "IR",
        },
        {
          code: "IRQ",
          name: "Iraq",
          digraph: "IZ",
        },
        {
          code: "IRL",
          name: "Ireland",
          digraph: "EI",
        },
        {
          code: "IMN",
          name: "Isle of Man",
          digraph: "IM",
        },
        {
          code: "ISR",
          name: "Israel",
          digraph: "IS",
        },
        {
          code: "ITA",
          name: "Italy",
          digraph: "IT",
        },
        {
          code: "JAM",
          name: "Jamaica",
          digraph: "JM",
        },
        {
          code: "JPN",
          name: "Japan",
          digraph: "JA",
        },
        {
          code: "JEY",
          name: "Jersey",
          digraph: "JE",
        },
        {
          code: "JOR",
          name: "Jordan",
          digraph: "JO",
        },
        {
          code: "KAZ",
          name: "Kazakhstan",
          digraph: "KZ",
        },
        {
          code: "KEN",
          name: "Kenya",
          digraph: "KE",
        },
        {
          code: "KIR",
          name: "Kiribati",
          digraph: "KR",
        },
        {
          code: "KV",
          name: "Kosovo",
          digraph: "KV",
        },
        {
          code: "KWT",
          name: "Kuwait",
          digraph: "KU",
        },
        {
          code: "KGZ",
          name: "Kyrgyzstan",
          digraph: "KG",
        },
        {
          code: "LAO",
          name: "Lao People's Democratic Republic",
          digraph: "LA",
        },
        {
          code: "LAO",
          name: "Laos",
          digraph: "LA",
        },
        {
          code: "LVA",
          name: "Latvia",
          digraph: "LG",
        },
        {
          code: "LBN",
          name: "Lebanon",
          digraph: "LE",
        },
        {
          code: "LSO",
          name: "Lesotho",
          digraph: "LT",
        },
        {
          code: "LBR",
          name: "Liberia",
          digraph: "LI",
        },
        {
          code: "LBY",
          name: "Libya",
          digraph: "LY",
        },
        {
          code: "LIE",
          name: "Liechtenstein",
          digraph: "LS",
        },
        {
          code: "LTU",
          name: "Lithuania",
          digraph: "LH",
        },
        {
          code: "LUX",
          name: "Luxembourg",
          digraph: "LU",
        },
        {
          code: "MAC",
          name: "Macau",
          digraph: "MC",
        },
        {
          code: "MDG",
          name: "Madagascar",
          digraph: "MA",
        },
        {
          code: "MWI",
          name: "Malawi",
          digraph: "MI",
        },
        {
          code: "MYS",
          name: "Malaysia",
          digraph: "MY",
        },
        {
          code: "MDV",
          name: "Maldives",
          digraph: "MV",
        },
        {
          code: "MLI",
          name: "Mali",
          digraph: "ML",
        },
        {
          code: "MLT",
          name: "Malta",
          digraph: "MT",
        },
        {
          code: "MHL",
          name: "Marshall Islands",
          digraph: "RM",
        },
        {
          code: "MTQ",
          name: "Martinique",
          digraph: "MB",
        },
        {
          code: "MRT",
          name: "Mauritania",
          digraph: "MR",
        },
        {
          code: "MUS",
          name: "Mauritius",
          digraph: "MP",
        },
        {
          code: "MYT",
          name: "Mayotte",
          digraph: "MF",
        },
        {
          code: "MEX",
          name: "Mexico",
          digraph: "MX",
        },
        {
          code: "MDA",
          name: "Moldova",
          digraph: "MD",
        },
        {
          code: "MCO",
          name: "Monaco",
          digraph: "MN",
        },
        {
          code: "MNG",
          name: "Mongolia",
          digraph: "MG",
        },
        {
          code: "MNE",
          name: "Montenegro",
          digraph: "MJ",
        },
        {
          code: "MSR",
          name: "Montserrat",
          digraph: "MH",
        },
        {
          code: "MAR",
          name: "Morocco",
          digraph: "MO",
        },
        {
          code: "MOZ",
          name: "Mozambique",
          digraph: "MZ",
        },
        {
          code: "MMR",
          name: "Myanmar",
          digraph: "MM",
        },
        {
          code: "NAM",
          name: "Namibia",
          digraph: "WA",
        },
        {
          code: "NRU",
          name: "Nauru",
          digraph: "NR",
        },
        {
          code: "NPL",
          name: "Nepal",
          digraph: "NP",
        },
        {
          code: "NLD",
          name: "Netherlands",
          digraph: "NL",
        },
        {
          code: "NCL",
          name: "New Caledonia",
          digraph: "NC",
        },
        {
          code: "NZL",
          name: "New Zealand",
          digraph: "NZ",
        },
        {
          code: "NIC",
          name: "Nicaragua",
          digraph: "NU",
        },
        {
          code: "NER",
          name: "Niger",
          digraph: "NG",
        },
        {
          code: "NGA",
          name: "Nigeria",
          digraph: "NI",
        },
        {
          code: "NIU",
          name: "Niue",
          digraph: "NE",
        },
        {
          code: "NFK",
          name: "Norfolk Island",
          digraph: "NF",
        },
        {
          code: "PRK",
          name: "North Korea",
          digraph: "KN",
        },
        {
          code: "MKD",
          name: "North Macedonia",
          digraph: "MK",
        },
        {
          code: "NOR",
          name: "Norway",
          digraph: "NO",
        },
        {
          code: "OMN",
          name: "Oman",
          digraph: "MU",
        },
        {
          code: "PAK",
          name: "Pakistan",
          digraph: "PK",
        },
        {
          code: "PLW",
          name: "Palau",
          digraph: "PS",
        },
        {
          code: "PSE",
          name: "Palestinian territories",
        },
        {
          code: "PAN",
          name: "Panama",
          digraph: "PM",
        },
        {
          code: "PNG",
          name: "Papua New Guinea",
          digraph: "PP",
        },
        {
          code: "PRY",
          name: "Paraguay",
          digraph: "PA",
        },
        {
          code: "PER",
          name: "Peru",
          digraph: "PE",
        },
        {
          code: "PHL",
          name: "Philippines",
          digraph: "RP",
        },
        {
          code: "PCN",
          name: "Pitcairn Islands",
          digraph: "PC",
        },
        {
          code: "POL",
          name: "Poland",
          digraph: "PL",
        },
        {
          code: "PRT",
          name: "Portugal",
          digraph: "PO",
        },
        {
          code: "PRI",
          name: "Puerto Rico",
          digraph: "PR",
        },
        {
          code: "QAT",
          name: "Qatar",
          digraph: "QA",
        },
        {
          code: "REU",
          name: "Reunion",
          digraph: "RE",
        },
        {
          code: "ROU",
          name: "Romania",
          digraph: "RO",
        },
        {
          code: "RUS",
          name: "Russia",
          digraph: "RS",
        },
        {
          code: "RWA",
          name: "Rwanda",
          digraph: "RW",
        },
        {
          code: "BLM",
          name: "Saint Barthelemy",
          digraph: "TB",
        },
        {
          code: "SHN",
          name: "Saint Helena, Ascension, and Tristan da Cunha",
          digraph: "SH",
        },
        {
          code: "KNA",
          name: "Saint Kitts and Nevis",
          digraph: "SC",
        },
        {
          code: "LCA",
          name: "Saint Lucia",
          digraph: "ST",
        },
        {
          code: "MAF",
          name: "Saint Martin",
          digraph: "RN",
        },
        {
          code: "SPM",
          name: "Saint Pierre and Miquelon",
          digraph: "SB",
        },
        {
          code: "VCT",
          name: "Saint Vincent and the Grenadines",
          digraph: "VC",
        },
        {
          code: "WSM",
          name: "Samoa",
          digraph: "WS",
        },
        {
          code: "SMR",
          name: "San Marino",
          digraph: "SM",
        },
        {
          code: "STP",
          name: "Sao Tome and Principe",
          digraph: "TP",
        },
        {
          code: "SAU",
          name: "Saudi Arabia",
          digraph: "SA",
        },
        {
          code: "SEN",
          name: "Senegal",
          digraph: "SG",
        },
        {
          code: "SRB",
          name: "Serbia",
          digraph: "RI",
        },
        {
          code: "SYC",
          name: "Seychelles",
          digraph: "SE",
        },
        {
          code: "SLE",
          name: "Sierra Leone",
          digraph: "SL",
        },
        {
          code: "SGP",
          name: "Singapore",
          digraph: "SN",
        },
        {
          code: "SXM",
          name: "Sint Maarten",
          digraph: "NN",
        },
        {
          code: "SVK",
          name: "Slovakia",
          digraph: "LO",
        },
        {
          code: "SVN",
          name: "Slovenia",
          digraph: "SI",
        },
        {
          code: "SLB",
          name: "Solomon Islands",
          digraph: "BP",
        },
        {
          code: "SOM",
          name: "Somalia",
          digraph: "SO",
        },
        {
          code: "ZAF",
          name: "South Africa",
          digraph: "SF",
        },
        {
          code: "SGS",
          name: "South Georgia and South Sandwich Islands",
          digraph: "SX",
        },
        {
          code: "KOR",
          name: "South Korea",
          digraph: "KS",
        },
        {
          code: "SSD",
          name: "South Sudan",
          digraph: "OD",
        },
        {
          code: "ESP",
          name: "Spain",
          digraph: "SP",
        },
        {
          code: "LKA",
          name: "Sri Lanka",
          digraph: "CE",
        },
        {
          code: "SDN",
          name: "Sudan",
          digraph: "SU",
        },
        {
          code: "SUR",
          name: "Suriname",
          digraph: "NS",
        },
        {
          code: "SJM",
          name: "Svalbard and Jan Mayen",
          digraph: "SV",
        },
        {
          code: "SWE",
          name: "Sweden",
          digraph: "SW",
        },
        {
          code: "CHE",
          name: "Switzerland",
          digraph: "SZ",
        },
        {
          code: "SYR",
          name: "Syria",
          digraph: "SY",
        },
        {
          code: "TWN",
          name: "Taiwan",
          digraph: "TW",
        },
        {
          code: "TJK",
          name: "Tajikistan",
          digraph: "TI",
        },
        {
          code: "TZA",
          name: "Tanzania",
          digraph: "TZ",
        },
        {
          code: "THA",
          name: "Thailand",
          digraph: "TH",
        },
        {
          code: "TLS",
          name: "Timor-Leste",
          digraph: "TT",
        },
        {
          code: "TGO",
          name: "Togo",
          digraph: "TO",
        },
        {
          code: "TKL",
          name: "Tokelau",
          digraph: "TL",
        },
        {
          code: "TON",
          name: "Tonga",
          digraph: "TN",
        },
        {
          code: "TTO",
          name: "Trinidad and Tobago",
          digraph: "TD",
        },
        {
          code: "TUN",
          name: "Tunisia",
          digraph: "TS",
        },
        {
          code: "TUR",
          name: "Turkey",
          digraph: "TU",
        },
        {
          code: "TKM",
          name: "Turkmenistan",
          digraph: "TX",
        },
        {
          code: "TCA",
          name: "Turks and Caicos Islands",
          digraph: "TK",
        },
        {
          code: "TUV",
          name: "Tuvalu",
          digraph: "TV",
        },
        {
          code: "UGA",
          name: "Uganda",
          digraph: "UG",
        },
        {
          code: "UKR",
          name: "Ukraine",
          digraph: "UP",
        },
        {
          code: "ARE",
          name: "United Arab Emirates",
          digraph: "AE",
        },
        {
          code: "GBR",
          name: "United Kingdom",
          digraph: "UK",
        },
        {
          code: "USA",
          name: "United States",
          digraph: "US",
        },
        {
          code: "VIR",
          name: "US Virgin Islands",
          digraph: "VI",
        },
        {
          code: "URY",
          name: "Uruguay",
          digraph: "UY",
        },
        {
          code: "UZB",
          name: "Uzbekistan",
          digraph: "UZ",
        },
        {
          code: "VUT",
          name: "Vanuatu",
          digraph: "NH",
        },
        {
          code: "VEN",
          name: "Venezuela",
          digraph: "VE",
        },
        {
          code: "VNM",
          name: "Vietnam",
          digraph: "VM",
        },
        {
          code: "WLF",
          name: "Wallis and Futuna",
          digraph: "WF",
        },
        {
          code: "WE",
          name: "West Bank",
          digraph: "WE",
        },
        {
          code: "ESH",
          name: "Western Sahara",
          digraph: "WI",
        },
        {
          code: "WW",
          name: "Worldwide",
        },
        {
          code: "YEM",
          name: "Yemen",
          digraph: "YM",
        },
        {
          code: "ZMB",
          name: "Zambia",
          digraph: "ZA",
        },
        {
          code: "ZWE",
          name: "Zimbabwe",
          digraph: "ZI",
        },
      ],
    },
    dissem_orgs: {
      displayName: "Audience",
      values: [
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "ANCESTRY",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Ancestry",
          id: 1,
          label: "Ancestry",
          legacy: false,
          name: "ANCESTRY",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "IC",
          code: "AGRICULTURE",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Agriculture",
          id: 2,
          label: "Agriculture",
          legacy: false,
          name: "AGRICULTURE",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "IC",
          code: "BANKING",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Banking",
          id: 3,
          label: "Banking",
          legacy: false,
          name: "BANKING",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "COMMERCE",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Commerce",
          id: 4,
          label: "Commerce",
          legacy: false,
          name: "COMMERCE",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "EDUCATION",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Education",
          id: 5,
          label: "Education",
          legacy: false,
          name: "EDUCATION",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "TREASURY",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Treasury",
          id: 6,
          label: "Treasury",
          legacy: false,
          name: "TREASURY",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
      ],
    },
    domestic_regions: {
      displayName: "Domestic Regions",
      values: [],
    },
    fisa_role: {
      displayname: "FISA Role",
      values: [],
    },
    issues: {
      displayName: "Issues",
      values: [
        {
          name: "Eastern Europe Geopolitics",
          code: "EEG",
          topics: [
            {
              name: "Belarus Relations",
              codes: ["BRL"],
            },
            {
              name: "Energy Crisis",
              codes: ["ENC"],
            },
          ],
        },
        {
          name: "Economic Turmoil",
          code: "ET",
          topics: [
            {
              name: "Global Inflation",
              codes: ["GLI"],
            },
            {
              name: "Interest Rates",
              codes: ["INR"],
            },
          ],
        },
        {
          name: "Supply Chain Crisis",
          code: "SCC",
          topics: [
            {
              name: "Resource Scarcity",
              codes: ["RSC"],
            },
          ],
        },
        {
          name: "Ukraine War",
          code: "UW",
          topics: [
            {
              name: "Annexation of Crimea",
              codes: ["ACR"],
            },
            {
              name: "Russian Invation",
              codes: ["RI"],
            },
          ],
        },
        {
          name: "Health and Natural Disasters",
          code: "HND",
          topics: [
            {
              name: "Health",
              codes: ["HLTH"],
            },
          ],
        },
        {
          name: "Terrorism and Homeland Security",
          code: "THS",
          topics: [
            {
              name: "Terrorism",
              codes: ["TERR"],
            },
          ],
        },
      ],
    },
    media_tags: {
      displayName: "Visuals",
      values: [
        {
          name: "audio",
          code: "audio",
        },
        {
          name: "interactive",
          code: "interactive",
        },
        {
          name: "graphic",
          code: "graphic",
        },
        {
          name: "map",
          code: "map",
        },
        {
          name: "video",
          code: "video",
        },
      ],
    },
    non_state_actors: {
      displayName: "Non State Actors",
      values: [
        {
          name: "EU",
          code: "EU",
        },
        {
          name: "NATO",
          code: "NATO",
        },
        {
          name: "UN",
          code: "UN",
        },
      ],
    },
    producing_offices: {
      displayName: "Producing Offices",
      values: [
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "ANCESTRY",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Ancestry",
          id: 1,
          label: "Ancestry",
          legacy: false,
          name: "ANCESTRY",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "IC",
          code: "AGRICULTURE",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Agriculture",
          id: 2,
          label: "Agriculture",
          legacy: false,
          name: "AGRICULTURE",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "IC",
          code: "BANKING",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Banking",
          id: 3,
          label: "Banking",
          legacy: false,
          name: "BANKING",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "COMMERCE",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Commerce",
          id: 4,
          label: "Commerce",
          legacy: false,
          name: "COMMERCE",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "EDUCATION",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Education",
          id: 5,
          label: "Education",
          legacy: false,
          name: "EDUCATION",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
        {
          ancestry: "1000",
          ancestry_depth: 1,
          category: "POLICY",
          code: "TREASURY",
          created_at: new Date("2011-07-30T16:38:33.000-04:00"),
          description: "Dept of Treasury",
          id: 6,
          label: "Treasury",
          legacy: false,
          name: "TREASURY",
          ntk_org: true,
          position: 2,
          updated_at: new Date("2014-12-16T18:22:22.000-05:00"),
          usgov_org: true,
          visible: true,
        },
      ],
    },
    product_types: {
      displayName: "Product Types",
      values: [
        {
          name: "Alert",
          code: 10391,
          publishable: true,
        },
        {
          name: "Bulletin",
          code: 10389,
          publishable: true,
        },
        {
          name: "Current",
          code: 10376,
          publishable: true,
        },
        {
          name: "Daily Brief",
          code: 10377,
          publishable: true,
        },
        {
          name: "Community Product",
          code: 10378,
          publishable: true,
        },
        {
          name: "CT Digest",
          code: 10379,
          publishable: true,
        },
        {
          name: "CT Weekly",
          code: 10380,
          publishable: true,
        },
        {
          name: "Foreign Product",
          code: 10381,
          publishable: true,
        },
        {
          name: "Special Threat Matrix",
          code: 10382,
          publishable: true,
        },
        {
          name: "SVTC Notes",
          code: 10383,
          publishable: true,
        },
        {
          name: "Terrorism Digest",
          code: 10384,
          publishable: true,
        },
        {
          name: "Terrorism Summary",
          code: 10385,
          publishable: true,
        },
        {
          name: "Threat Matrix",
          code: 10386,
          publishable: true,
        },
        {
          name: "Threat of Key Concern",
          code: 10392,
          publishable: true,
        },
        {
          name: "Watch",
          code: 10390,
          publishable: true,
        },
      ],
    },
    regions: {
      displayName: "Regions",
      values: [
        {
          name: "Africa",
          code: "AF",
          subregions: ["AFce", "AFea", "AFno", "AFso", "AFwe"],
        },
        {
          name: "Americas",
          code: "AM",
          subregions: ["AMca", "AMce", "AMno", "AMso", "AMan"],
        },
        {
          name: "Asia",
          code: "AS",
          subregions: ["ASea", "ASso", "ASse"],
        },
        {
          name: "Eurasia",
          code: "EA",
          subregions: ["EAca", "EAce", "EAru"],
        },
        {
          name: "Europe",
          code: "EU",
          subregions: ["EUba", "EUce", "EUno", "EUso"],
        },
        {
          name: "Middle East",
          code: "ME",
          subregions: ["MEme"],
        },
        {
          name: "Oceania",
          code: "OC",
          subregions: ["OCoc"],
        },
        {
          name: "Worldwide",
          code: "WW",
          subregions: [],
        },
      ],
    },
    reporting_types: {
      displayName: "Reporting Types",
      values: [
        {
          name: "Analysis: All Source",
          code: "analysis.all_source",
          productTypes: [
            1000, 1001, 10376, 10377, 10378, 10379, 10380, 10381, 10382, 10383,
            10384, 10385, 10389, 10390, 10391, 10392,
          ],
        },
        {
          name: "Reporting: Enterprise",
          code: "reporting.enterprise",
          productTypes: [1002, 1003],
        },
        {
          name: "Reporting: Mass",
          code: "reporting.mass",
          productTypes: [1004, 1005],
        },
        {
          name: "Reporting: Mission",
          code: "reporting.mission",
          productTypes: [1006, 1007],
        },
      ],
    },
    selected_for: {
      displayName: "Front Page Featured",
      values: [
        {
          name: "Featured",
          code: "featured",
        },
      ],
    },
    subregions: {
      displayName: "Subregions",
      values: [
        {
          name: "Africa, Central",
          code: "AFce",
          country_codes: [
            "BDI",
            "CAF",
            "COD",
            "COG",
            "GAB",
            "RWA",
            "TZA",
            "UGA",
          ],
        },
        {
          name: "Africa, East",
          code: "AFea",
          country_codes: ["DJI", "ERI", "ETH", "KEN", "SOM", "SDN", "SSD"],
        },
        {
          name: "Africa, North",
          code: "AFno",
          country_codes: ["DZA", "EGY", "ESH", "LBY", "MAR", "TUN"],
        },
        {
          name: "Africa, Southern",
          code: "AFso",
          country_codes: [
            "AGO",
            "ATF",
            "BVT",
            "BWA",
            "COM",
            "HMD",
            "LSO",
            "MDG",
            "MOZ",
            "MUS",
            "MWI",
            "MYT",
            "NAM",
            "REU",
            "SHN",
            "SWZ",
            "SYC",
            "ZAF",
            "ZMB",
            "ZWE",
          ],
        },
        {
          name: "Africa, West",
          code: "AFwe",
          country_codes: [
            "BEN",
            "BFA",
            "CIV",
            "CMR",
            "CPV",
            "GHA",
            "GIN",
            "GMB",
            "GNB",
            "GNQ",
            "LBR",
            "MLI",
            "MRT",
            "NER",
            "NGA",
            "SEN",
            "SLE",
            "STP",
            "TCD",
            "TGO",
          ],
        },
        {
          name: "Americas, Caribbean",
          code: "AMca",
          country_codes: [
            "ABW",
            "AIA",
            "ATG",
            "BES",
            "BHS",
            "BLM",
            "BRB",
            "CUB",
            "CUW",
            "CYM",
            "DMA",
            "DOM",
            "GLP",
            "GRD",
            "HTI",
            "JAM",
            "KNA",
            "LCA",
            "MAF",
            "MSR",
            "MTQ",
            "PRI",
            "SXM",
            "TCA",
            "TTO",
            "VCT",
            "VGB",
            "VIR",
          ],
        },
        {
          name: "Americas, Central",
          code: "AMce",
          country_codes: ["BLZ", "CRI", "GTM", "HND", "NIC", "PAN", "SLV"],
        },
        {
          name: "Americas, North",
          code: "AMno",
          country_codes: ["BMU", "CAN", "MEX", "SPM", "USA"],
        },
        {
          name: "Americas, South",
          code: "AMso",
          country_codes: [
            "ARG",
            "BOL",
            "BRA",
            "CHL",
            "COL",
            "ECU",
            "FLK",
            "GUF",
            "GUY",
            "PER",
            "PRY",
            "SGS",
            "SUR",
            "URY",
            "VEN",
          ],
        },
        {
          name: "Antarctica",
          code: "AMan",
          country_codes: ["ATA"],
        },
        {
          name: "Asia, East",
          code: "ASea",
          country_codes: [
            "CHN",
            "HKG",
            "JPN",
            "KOR",
            "MAC",
            "MNG",
            "PRK",
            "TWN",
          ],
        },
        {
          name: "Asia, South",
          code: "ASso",
          country_codes: [
            "AFG",
            "BGD",
            "BTN",
            "IND",
            "IOT",
            "LKA",
            "MDV",
            "NPL",
            "PAK",
          ],
        },
        {
          name: "Asia, South East",
          code: "ASse",
          country_codes: [
            "BRN",
            "CCK",
            "CXR",
            "IDN",
            "KHM",
            "LAO",
            "MMR",
            "MYS",
            "PHL",
            "SGP",
            "THA",
            "TLS",
            "VNM",
          ],
        },
        {
          name: "Eurasia, Caucasus",
          code: "EAca",
          country_codes: ["ARM", "AZE", "GEO"],
        },
        {
          name: "Eurasia, Central",
          code: "EAce",
          country_codes: ["KAZ", "KGZ", "TJK", "TKM", "UZB"],
        },
        {
          name: "Eurasia, Western and Russia",
          code: "EAru",
          country_codes: ["BLR", "MDA", "RUS", "UKR"],
        },
        {
          name: "Europe, Balkans",
          code: "EUba",
          country_codes: ["ALB", "BIH", "HRV", "MKD", "SRB", "MNE", "KV"],
        },
        {
          name: "Europe, Central",
          code: "EUce",
          country_codes: [
            "AUT",
            "BGR",
            "CHE",
            "CZE",
            "HUN",
            "LIE",
            "POL",
            "ROU",
            "SVN",
            "SVK",
          ],
        },
        {
          name: "Europe, North",
          code: "EUno",
          country_codes: [
            "ALA",
            "BEL",
            "DEU",
            "DNK",
            "EST",
            "FIN",
            "FRA",
            "FRO",
            "GBR",
            "GGY",
            "GRL",
            "IMN",
            "IRL",
            "ISL",
            "JEY",
            "LTU",
            "LUX",
            "LVA",
            "NLD",
            "NOR",
            "SJM",
            "SWE",
          ],
        },
        {
          name: "Europe, South",
          code: "EUso",
          country_codes: [
            "AND",
            "CYP",
            "ESP",
            "GIB",
            "GRC",
            "ITA",
            "MCO",
            "MLT",
            "PRT",
            "SMR",
            "TUR",
            "VAT",
          ],
        },
        {
          name: "Middle East",
          code: "MEme",
          country_codes: [
            "ARE",
            "BHR",
            "PSE",
            "GZ",
            "WE",
            "IRN",
            "IRQ",
            "ISR",
            "JOR",
            "KWT",
            "LBN",
            "OMN",
            "QAT",
            "SAU",
            "SYR",
            "YEM",
          ],
        },
        {
          name: "Oceania",
          code: "OCoc",
          country_codes: [
            "ASM",
            "AUS",
            "COK",
            "FJI",
            "FSM",
            "GUM",
            "KIR",
            "MHL",
            "MNP",
            "NCL",
            "NFK",
            "NIU",
            "NRU",
            "NZL",
            "PCN",
            "PLW",
            "PNG",
            "PYF",
            "SLB",
            "TKL",
            "TON",
            "TUV",
            "VUT",
            "WLF",
            "WSM",
          ],
        },
      ],
    },
    topics: {
      displayName: "Topics",
      values: [
        {
          name: "Annexation of Crimea",
          code: "ACR",
        },
        {
          name: "Belarus Relations",
          code: "BRL",
        },
        {
          name: "Energy Crisis",
          code: "ENC",
        },
        {
          name: "Global Inflation",
          code: "GLI",
        },
        {
          name: "Health",
          code: "HLTH",
        },
        {
          name: "Interest Rates",
          code: "INR",
        },
        {
          name: "Resource Scarcity",
          code: "RSC",
        },
        {
          name: "Russian Invasion",
          code: "RI",
        },
        {
          name: "Terrorism",
          code: "TERR",
        },
      ],
    },
  },
  featuresAvailable: {},
  highlightsBanner: "",
  highlightsNavHeader: "",
  name: "",
  nonProduction: false,
  project: "",
  resourceLinks: [],
  searchFilters: [],
  siteClassification: "",
  siteDefaultTitle: "",
});

const loadElasticSearch = async (esUrl) => {
  const client = new Client({ node: esUrl });

  for (const article of articles) {
    logger.info(`loading article ${article._id}`)
    await client.index({
      index: "products",
      body: article.indexable,
      id: article.id,
    });
  }

  await client.indices.refresh({ index: "products" });
};

const loadMetadata = async (mongoUrl) => {
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
  });

  await metadata.save();
  mongoose.connection.close();
};

const loadArticlesIntoMongo = async (mongoUrl) => {
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
  });

  for (let article of articles) {
    if (Array.isArray(article.htmlBody)) {
      article.htmlBody = article.htmlBody.join("");
    }
    await article.save();
  }
  mongoose.connection.close();
};

const loadSavedProducts = async (postgresUrl) => {
  const sequelize = new Sequelize(postgresUrl);

  const savedProductModel = require("../../src/models/saved_product");
  savedProductModel(sequelize);

  await sequelize.models.SavedProduct.sync();

  await sequelize.models.SavedProduct.create({
    productId: "WIReWIRe_sample_1",
    createdBy: 1,
  });
};

const loadSavedProductsForSearch = async (esUrl) => {
  const client = new Client({ node: esUrl });

  await client.index({
    index: "savedproducts",
    body: {
      ...articles[0].indexable,
      savedProductUserId: 1,
      productId: "WIReWIRe_sample_1"
    },
    id: "blah"
  });

  await client.indices.refresh({ index: "savedproducts" });
}

const loadCollections = async (postgresUrl) => {
  const sequelize = new Sequelize(postgresUrl);

  const collectionModel = require("../../src/models/collection");
  collectionModel(sequelize);

  await sequelize.models.Collection.sync();

  await sequelize.models.Collection.create({
    name: "Sample Collection",
    description: "Sample Collection description",
    createdBy: 1,
  });
};

const loadCollectionProducts = async (postgresUrl) => {
  const sequelize = new Sequelize(postgresUrl);

  const collectionModel = require("../../src/models/collection");
  collectionModel(sequelize);

  const savedProductModel = require("../../src/models/saved_product");
  savedProductModel(sequelize);

  const collectionProductsModel = require("../../src/models/collection_products");
  collectionProductsModel(sequelize);

  await sequelize.models.Collection.sync();
  await sequelize.models.SavedProduct.sync();
  await sequelize.models.CollectionProducts.sync();

  sequelize.models.Collection.belongsToMany(sequelize.models.SavedProduct, {
    through: sequelize.models.CollectionProducts,
  });
  sequelize.models.SavedProduct.belongsToMany(sequelize.models.Collection, {
    through: sequelize.models.CollectionProducts,
  });

  const savedProducts = await sequelize.models.SavedProduct.findAll();
  const collection = await sequelize.models.Collection.findOne({
    include: sequelize.models.SavedProduct,
  });

  collection.addSavedProducts(savedProducts);
};

const loadUsers = async (postgresUrl) => {
  const sequelize = new Sequelize(postgresUrl);

  const userModel = require("../../src/models/user");
  userModel(sequelize);

  await sequelize.models.User.sync();

  await sequelize.models.User.create({
    email: "foo@example.com",
    dn: "O=US,OU=OFFICE,CN=foo",
  });
};

module.exports = {
  loadElasticSearch,
  loadMetadata,
  loadArticlesIntoMongo,
  loadSavedProducts,
  loadSavedProductsForSearch,
  loadCollections,
  loadCollectionProducts,
  loadUsers,
  articles,
  metadata,
};
