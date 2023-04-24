<template>
  <div class="pt-5 pb-5">
    <h3 class="sr-only">Results Toolbar</h3>
    <b-row>
      <b-col class="my-auto">
        <div v-if="!visualsPage" class="d-flex align-items-center">
          <div class="pt-1 pl-3">
            <span> Select items for </span>
            <b-button
              variant="link"
              class="p-0 mb-1"
              :class="{ active: active === 'export' }"
              @click="enableTool('export')"
              >exports</b-button
            >,
            <b-button
              variant="link"
              class="p-0 mb-1"
              :class="{ active: active === 'folder' }"
              @click="enableTool('folder')"
              >folders</b-button
            ><span v-if="featuresAvailable.tags">, or</span>
            <b-button
              v-if="featuresAvailable.tags"
              variant="link"
              class="p-0 mb-1"
              :class="{ active: active === 'tag' }"
              @click="enableTool('tag')"
              >tags</b-button
            >
          </div>
        </div>
      </b-col>
      <b-col class="my-auto" align="center">
        <ResultsToolbar class="results" />
      </b-col>
      <b-col class="my-auto" align="right">
        <div class="d-flex align-items-center">
          <SortOrder class="ml-auto" />
          <ViewSelector />
        </div>
      </b-col>
    </b-row>
    <DaClassificationErrorNotification
      v-if="featuresAvailable.daClassificationErrorNotification"
    />
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import ViewSelector from "@shared/ViewSelector";
import WireBackgroundAsset from "@shared/WireBackgroundAsset";
import ResultsToolbar from "../search/ResultsToolbar";
import SortOrder from "../search/SortOrder";
import DaClassificationErrorNotification from "../search/DaClassificationErrorNotification";

export default {
  name: "ResultsNav",
  components: {
    SortOrder,
    ResultsToolbar,
    ViewSelector,
    WireBackgroundAsset,
    DaClassificationErrorNotification,
  },
  props: ["title", "stacked"],

  data() {
    return {
      active: "",
    };
  },

  methods: {
    ...mapMutations("search", [
      "setShowFilters",
      "setSelecting",
      "setShowContext",
    ]),

    clearForms() {
      this.setSelecting(false);
    },
    enableTool(tool) {
      this.setSelecting(tool);
      this.active = tool;
      this.$bus.$emit("set-" + tool);
    },
  },
  computed: {
    ...mapState("search", ["showFilters", "selecting"]),
    ...mapState("metadata", ["featuresAvailable"]),

    visualsPage() {
      if (this.$route.query) {
        return this.$route.query.visuals === "visuals";
      }
      return false;
    },
  },
  mounted() {
    this.$bus.$on("close-form", () => {
      this.clearForms();
      this.active = "";
    });
    this.$bus.$on("remove-search-tools-active", () => {
      this.active = "";
    });
  },
  destroyed() {
    this.clearForms();
  },
};
</script>

<style scoped lang="scss">
.results {
  color: $alt-800;
  line-height: 1;
  margin-bottom: unset;
}

.select-box {
  height: 18px;
  width: 18px;
}

.active {
  border-top: 3px solid $sec-400;
  border-radius: unset;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
