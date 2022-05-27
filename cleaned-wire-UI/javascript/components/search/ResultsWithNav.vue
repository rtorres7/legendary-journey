<template>
  <div>
    <h2 class="sr-only">Results Section</h2>
    <ResultsNav />
    <b-form
      @submit.prevent
      class="search-results-container"
      v-on:reset-form="form.checked = []"
    >
      <div
        :class="{ 'transitioned-div': selectedControls !== undefined }"
        class="_temp_488-5"
      >
        <transition name="fade" mode="out-in">
          <component
            :is="selectedControls"
            :form="form"
            class="transitioned-component mb-7 search-tools"
          />
        </transition>
      </div>
      <b-form-group>
        <b-form-checkbox-group v-model="form.checked" id="results-checkboxes">
          <Results />
        </b-form-checkbox-group>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import { isEmpty } from "lodash";
import { mapState } from "vuex";

import AddToFolder from "../selectWithinResults/AddToFolder";
import ExportControls from "../selectWithinResults/ExportControls";
import Results from "./Results";
import ResultsNav from "../shared/ResultsNav";
import SaveSearch from "../selectWithinResults/SaveSearch";
import TagControls from "../selectWithinResults/TagControls.vue";

export default {
  name: "ResultsWithNav",
  components: {
    AddToFolder,
    ExportControls,
    Results,
    ResultsNav,
    SaveSearch,
    TagControls,
  },
  data() {
    return {
      form: {
        checked: [],
      },
    };
  },
  computed: {
    ...mapState("search", ["selecting"]),

    selectedControls() {
      if (this.selecting === "export") {
        return ExportControls;
      } else if (this.selecting === "tag") {
        return TagControls;
      } else if (this.selecting === "folder") {
        return AddToFolder;
      } else if (this.selecting === "saveSearch") {
        return SaveSearch;
      }
    },
  },
  methods: {
    clearForms() {
      this.form.checked = [];
    },
  },
  mounted() {
    this.$bus.$on("close-form", () => {
      this.clearForms();
    });
  },
  watch: {
    $route() {
      if (!isEmpty(this.form.checked)) {
        this.clearForms();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.transitioned-component {
  width: 100%;
}

//TODO Vue/SCSS -- should pull the @include in .search-results-container style back from wire.scss
</style>
