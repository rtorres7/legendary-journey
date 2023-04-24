<template>
  <div class="pills container-fluid pt-5 pb-2">
    <h2 class="sr-only">Selected Criteria Summary</h2>
    <div class="align-items-center d-flex flex-wrap standard-page-margin">
      <div class="d-inline-flex mb-4" v-for="(pill, ind) in pills" :key="ind">
        <PillGroup
          v-if="
            noViewLayouts(pill) && noBool(pill) && noEmpty(pill) && noDate(pill)
          "
          :pillData="pill"
        />
      </div>
      <div class="d-inline-flex mb-4" v-for="pill in pills" :key="pill.name">
        <PillGroup :pillData="dateRange" v-if="pill.name === 'start_date'" />
      </div>
      <div class="d-inline-flex mb-4 search-actions">
        <b-button
          class="py-0 d-inline-flex search-action"
          @click="clearAll"
          :disabled="disableClear"
          variant="link"
        >
          <WireBackgroundAsset
            class="pill-row-icon reset-icon my-auto"
            imageName="reset.svg"
            fill
          />
          <div class="pill-button-text" aria-hidden="true">Reset</div>
          <div class="sr-only">reset filters to defaults</div>
        </b-button>
        <b-button
          class="py-0 d-inline-flex search-action"
          :to="rssLink"
          v-if="featuresAvailable.searchRssLinksEnabled && !hideForFSS"
          target="_blank"
          variant="link"
        >
          <WireBackgroundAsset
            class="pill-row-icon my-auto"
            imageName="rss.svg"
            fill
          />
          <div class="pill-button-text">RSS</div>
        </b-button>
        <b-button
          class="py-0 d-inline-flex search-action"
          @click="setUpSaveForm"
          :active="selecting === 'saveSearch'"
          variant="link"
          v-if="!visualsPage && !hideForFSS"
          data-usage="save-search"
        >
          <WireBackgroundAsset
            class="pill-row-icon save-icon my-auto"
            imageName="save.svg"
            fill
          />
          <div class="pill-button-text" aria-hidden="true">Save</div>
          <div class="sr-only">save search</div>
        </b-button>
        <SearchMetrics v-if="!hideForFSS" />
      </div>
    </div>
  </div>
</template>

<script>
import { find, forEach, isEmpty } from "lodash";
import { mapGetters, mapMutations, mapState } from "vuex";
import PillGroup from "./PillGroup";
import WireBackgroundAsset from "@shared/WireBackgroundAsset";
import SearchMetrics from "./SearchMetrics";

export default {
  name: "Pills",
  components: { PillGroup, SearchMetrics, WireBackgroundAsset },
  props: ["hideForFSS"],
  computed: {
    ...mapState("search", {
      getCompact: "compact",
      selecting: "selecting",
      previousSearch: "previousSearch",
    }),
    ...mapState("metadata", ["featuresAvailable"]),
    ...mapGetters("search", ["rssLink"]),
    pills() {
      let values = [];
      const blackList = [
        "utf8",
        "_bool",
        "sort_by",
        "fsort_dir",
        "tags[]",
        "id",
        "page",
        "fpage",
        "view",
        "sensitive",
        "search_title",
        "search_reporting_type",
      ];
      if (this.hideForFSS) {
        const FssBlackList = [
          "regions[]",
          "subregions[]",
          "issues[]",
          "reporting_types[]",
          "product_types[]",
          "media_tags[]",
          "non_state_actors[]",
          "producing_offices[]",
          "selected_for[]",
          "classification[]",
        ];
        FssBlackList.forEach(function (param) {
          blackList.push(param);
        });
      } else {
        blackList.push("_temp_39");
      }
      forEach(this.$route.query, (value, query) => {
        if (!blackList.includes(query) && !isEmpty(value)) {
          values.push({
            name: query.replace("[]", ""),
            query,
            value,
          });
        }
      });
      return values;
    },

    dateRange() {
      const start_date = find(this.pills, function (pill) {
        return pill.query === "start_date";
      });
      const end_date =
        find(this.pills, function (pill) {
          return pill.query === "end_date";
        }) || new Date();

      return {
        name: "dateRange",
        query: "dateRange",
        value: `${this.formatDate(start_date)} - ${this.formatDate(end_date)}`,
      };
    },

    disableClear() {
      // In order to make the clear all disable at sensible points we need to make it not clickable when more "meta"
      //   data type things have been selected. For instance, changing the sort should not mean that you can now click
      //   clear all.
      var editableQuery = Object.assign({}, this.$route.query);
      delete editableQuery.sort_dir;
      delete editableQuery.sort_field;
      delete editableQuery.grid;
      delete editableQuery.list;
      delete editableQuery.visuals;
      return isEmpty(editableQuery);
    },

    visualsPage() {
      if (this.$route.query) {
        return this.$route.query.visuals === "visuals";
      }
      return false;
    },
  },

  methods: {
    ...mapMutations("search", ["setCompact", "setSelecting"]),

    formatDate(dateVal) {
      return dateVal ? this.$moment(dateVal.value).format("MM/DD/YYYY") : "";
    },

    setUpSaveForm() {
      this.$bus.$emit("remove-search-tools-active");
      this.setSelecting("saveSearch");
    },

    clearAll() {
      this.$bus.$emit("clear-search");
    },

    noViewLayouts(pill) {
      return !["grid", "list", "visuals", "sort_dir", "sort_field"].includes(
        pill.name
      );
    },

    noBool(pill) {
      return !pill.name.includes("_bool");
    },

    noDate(pill) {
      return !pill.name.includes("date");
    },

    noEmpty(pill) {
      if (pill && pill.value) {
        return pill.value.length > 0;
      }
    },

    Metrics() {},
  },
};
</script>

<style scoped lang="scss">
::v-deep .pill-row-icon {
  height: 14px;
  width: 14px;
}
::v-deep .reset-icon,
::v-deep .save-icon {
  width: 14px;
  height: 14px;
}
::v-deep .pill-button-text {
  margin-left: 4px;
  font-size: $font-size-1;
  color: $pri-800;
}
.pills {
  background-color: $alt-200;
  position: sticky;
  top: 70px;
  border-bottom: solid 1px $alt-500;
  border-top: solid 1px $alt-500;
  z-index: 2;

  @media only screen and (max-width: $screen-md) {
    top: 0px;
  }
}
::v-deep .badge {
  font-size: 100%;
  padding-top: 1px;
  padding-bottom: 1px;
}
.search-actions {
  .btn.disabled {
    color: $alt-900;
  }
}
.search-actions .search-action:first-child {
  padding-left: 0;
}
</style>
