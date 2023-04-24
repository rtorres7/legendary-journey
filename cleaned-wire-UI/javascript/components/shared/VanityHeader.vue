<template>
  <div>
    <VanityTitle :title="titleName" :code="code ? code : title">
      <slot></slot>
    </VanityTitle>
    <div v-if="showTabs">
      <b-tabs
        active-nav-item-class="font-weight-bold"
        class="search-tabs standard-page-margin mt-4"
        v-model="tabIndex"
        @input="toggleTab"
      >
        <b-tab :title="'WIRe Results (' + resultsWire + ')'"></b-tab>
        <b-tab
          :active="startOnFss"
          :title="'Sensitive Results (' + resultsFSS + ')'"
        ></b-tab>
      </b-tabs>
      <div :hidden="onFssTab">
        <FssCriteria />
      </div>
      <div :hidden="!onFssTab">
        <Criteria />
      </div>
    </div>
    <Criteria v-else />
  </div>
</template>

<script>
import VanityTitle from "../vanity/VanityTitle";
import Criteria from "../search/criteria/index";
import FssCriteria from "../search/criteria/FssCriteria";
import { mapState } from "vuex";

export default {
  name: "VanityHeader",
  props: ["title", "code", "showTabs", "startOnFss"],
  data() {
    return {
      tabIndex: 0,
      resultsFSS: "Loading..",
    };
  },
  computed: {
    ...mapState("search", ["loading", "totalCount"]),
    onFssTab() {
      return this.tabIndex == 0;
    },
    resultsWire() {
      return this.loading ? "Loading.." : this.totalCount;
    },
    titleName() {
      const titleInQuery = this.$route.query["search_title"];
      return titleInQuery ? titleInQuery : this.title;
    },
  },
  mounted() {
    this.$bus.$on("countUpdateFSS", (tabLabel) => {
      this.resultsFSS = tabLabel;
    });
  },
  components: { Criteria, FssCriteria, VanityTitle },
  methods: {
    toggleTab(index) {
      this.$bus.$emit("onTab", index);
    },
  },
};
</script>

<style scoped lang="scss">
.search-tabs {
  font-size: $font-size-4;
  font-family: "Roboto Condensed";
  color: $pri-600;
  padding-top: 0.5rem;
}
</style>
