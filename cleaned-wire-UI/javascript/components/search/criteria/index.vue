<template>
  <div class="d-flex my-4">
    <h2 class="sr-only">SDS Search Criteria</h2>
    <b-row class="flex-grow-1">
      <template v-for="(searchFilter, index) in searchFilters">
        <component
          :key="searchFilter.component"
          :is="searchFilter.component"
          :label="searchFilter.label"
          :sizes="columnProperties(searchFilter.component, index)"
          :class="cssClasses(searchFilter.component)"
          class="selector"
        />
      </template>
    </b-row>

    <b-button
      @click="showAll = !showAll"
      class="mb-auto mt-7 pt-5 pr-0 ml-2 d-flex flex-column"
      variant="link"
    >
      <!-- Random `flex-column` wrapper is necessary for IE11 -->
      <div class="d-flex">
        <div v-if="showAll" class="ml-4 mr-3">Less</div>
        <div v-else class="ml-4 mr-3">More</div>
        <WireBackgroundAsset
          image-name="less-more.svg"
          class="less-more-image m-auto"
          fill
          :class="{ rotate: showAll }"
        />
      </div>
    </b-button>
  </div>
</template>

<script>
import KeywordAndDate from "./KeywordAndDate";
import RegionsSubregionsCountries from "./RegionsSubregionsCountries";
import IssuesTopics from "./IssuesTopics";
import ReportingProductTypes from "./ReportingProductTypes";
import Classification from "./Classification";
import AudioVisualMedia from "./AudioVisualMedia";
import NonStateActors from "./NonStateActors";
import ProducingOffice from "./ProducingOffice";
import EditorsPick from "./EditorsPick";
import DomesticRegions from "./DomesticRegions";
import FisaPoaAndUsPerson from "./FisaPoaAndUsPerson";
import WireBackgroundAsset from "../../shared/WireBackgroundAsset";
import { mapState } from "vuex";

export default {
  name: "Criteria",
  components: {
    WireBackgroundAsset,
    FisaPoaAndUsPerson,
    DomesticRegions,
    EditorsPick,
    ProducingOffice,
    NonStateActors,
    AudioVisualMedia,
    Classification,
    ReportingProductTypes,
    IssuesTopics,
    RegionsSubregionsCountries,
    KeywordAndDate,
  },
  data() {
    return {
      showAll: false,
      selectorSizes: {
        cols: 24,
        sm: 11,
        md: 7,
        lg: 4,
        xl: 4,
        "offset-sm": 1,
        "offset-md": 1,
        "offset-lg": 1,
        "offset-xl": 1,
      },
      keywordSizes: {
        cols: 24,
        sm: 24,
        md: 15,
        lg: 9,
        xl: 9,
      },
    };
  },
  computed: {
    ...mapState("metadata", ["searchFilters"]),
    hideShowCss() {
      return this.showAll ? "d-block" : "d-none";
    },
    componentNames() {
      return this.searchFilters.map((x) => x.component);
    },
    useAlternateLayout() {
      return this.componentNames.includes("FisaPoaAndUsPerson");
    },
  },
  mounted() {
    if (this.$route.name === "search") {
      this.showAll = true;
    }
  },
  methods: {
    columnProperties(componentName, index) {
      if (componentName === "KeywordAndDate") {
        // reduce columns size to make room for fisa/poa/usper
        let properties = Object.assign({}, this.keywordSizes);
        if (this.useAlternateLayout) {
          properties["lg"] = 7;
          properties["xl"] = 7;
        }
        return properties;
      } else {
        let properties = Object.assign({}, this.selectorSizes);

        let colNum = index + 1;
        // remove offset on first field on a line

        // when columns wrap on 5 lines (sm mode)
        if (colNum % 2 === 0) {
          properties["offset-sm"] = 0;
        }
        // column wrap on 3 lines (md mode)
        if (colNum % 3 === 0) {
          properties["offset-md"] = 0;
        }
        // column wrap on 2 lines (lg and xl mode)
        if (colNum % 5 === 0) {
          properties["offset-lg"] = 0;
          properties["offset-xl"] = 0;
        }

        // adjust columns to make room for fisa/poa/usper
        if (this.useAlternateLayout) {
          // make classification and producing division smaller
          if (colNum === 5 || colNum === 6) {
            properties["lg"] = 3;
            properties["xl"] = 3;
          }
          // when displaying 2 lines, make last field column larger
          if (colNum % 5 === 4) {
            properties["lg"] = 6;
            properties["xl"] = 6;
          }
          // span this wrapper component across the whole last line
          if (componentName === "FisaPoaAndUsPerson") {
            properties["md"] = 24;
          }
        }

        return properties;
      }
    },
    cssClasses(componentName) {
      // search filters on first line are always visible
      switch (componentName) {
        case "KeywordAndDate":
          return "keyword-and-date";
        case "RegionsSubregionsCountries":
          return "d-md-block " + this.hideShowCss;
        case "IssuesTopics":
          return "d-lg-block " + this.hideShowCss;
        case "ReportingProductTypes":
          return "d-lg-block " + this.hideShowCss;
        default:
          return this.hideShowCss;
      }
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep label {
  font-size: $font-size-3;
  font-family: $font-family-heading;
  font-weight: 700;
  color: $alt-800;
  margin-bottom: 6px;
}
.selector {
  margin-top: 16px;
  margin-bottom: 16px;
}
.less-more-image {
  height: $font-size-2;
  width: $font-size-2;
}

.rotate {
  transform: rotate(180deg);
}

::v-deep legend.col-form-label {
  font-size: $font-size-3;
  font-family: $font-family-heading;
  font-weight: 700;
  color: $alt-800;
  padding: 0px 0px 6px 6px;
  margin-top: 0px;
}
</style>
