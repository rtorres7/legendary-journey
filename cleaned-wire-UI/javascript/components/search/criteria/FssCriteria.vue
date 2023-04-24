<template>
  <div class="d-flex my-4">
    <h2 class="sr-only">Main Search Criteria</h2>
    <b-row class="flex-grow-1">
      <KeywordAndDate
        :hideForFSS="true"
        :sizes="columnProperties('KeywordAndDate', 0)"
        class="selector keyword-and-date"
      />
      <RegionsSubregionsCountries
        :hideForFSS="true"
        :sizes="columnProperties('RegionsSubregionsCountries', 1)"
        class="selector d-md-block d-block"
        label="Countries"
      />
      <IssuesTopics
        label="Topics"
        :hideForFSS="true"
        :sizes="columnProperties('IssuesTopics', 2)"
        class="selector d-lg-block d-block"
      />
    </b-row>
  </div>
</template>

<script>
import KeywordAndDate from "./KeywordAndDate";
import RegionsSubregionsCountries from "./RegionsSubregionsCountries";
import IssuesTopics from "./IssuesTopics";

export default {
  name: "FssCriteria",
  components: {
    RegionsSubregionsCountries,
    IssuesTopics,
    KeywordAndDate,
  },
  data() {
    return {
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
      hideShowCss: {
        default: "d-block",
      },
    };
  },
  methods: {
    columnProperties(componentName, index) {
      if (componentName === "KeywordAndDate") {
        let properties = Object.assign({}, this.keywordSizes);
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
</style>
