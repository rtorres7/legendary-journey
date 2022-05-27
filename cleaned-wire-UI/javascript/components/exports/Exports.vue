<template>
  <div class="mt-6 standard-page-margin my-exports">
    <vanity-title title="My Exports"></vanity-title>
    <b-container fluid>
      <b-row>
        <b-col cols="24" md="20">
          <p class="mt-6">
            Exports provide easy, time-limited access to downloadable versions
            of your curated collections of documents. You can export documents
            from Search by using the exports link above the search results.
            After exporting documents, you can re-download them here for one
            week. Exports are deleted after that time, but you can always
            regenerate them.
          </p>
        </b-col>
      </b-row>
      <div
        v-if="loading"
        class="d-flex justify-content-center align-items-center loading-area"
      >
        <spinner />
      </div>
      <b-row v-else class="export-list">
        <b-col
          v-for="myexport in this.exportList"
          :key="myexport.id"
          cols="24"
          lg="12"
        >
          <div>
            <MyExport :myexport="myexport" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import MyExport from "../exports/MyExport";
import VanityTitle from "../vanity/VanityTitle";
import SelectAll from "../selectWithinResults/SelectAll";
import Spinner from "../shared/Spinner";
import { mapGetters } from "vuex";
import { mapState } from "vuex";

export default {
  name: "Exports",
  components: { SelectAll, VanityTitle, MyExport, Spinner },

  mounted() {
    this.$store.dispatch("exports/loadExports", { caller: this });
  },
  computed: {
    ...mapGetters("exports", { exportList: "exports" }),
    ...mapGetters("exports", ["loading"]),
    ...mapState("user", ["user"]),
  },
};
</script>

<style scoped lang="scss">
.my-exports {
  padding-bottom: 7rem;
}
</style>
