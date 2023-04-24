<template>
  <div ref="results">
    <h3 class="sr-only">Results</h3>
    <div v-if="loading">
      <spinner />
    </div>
    <div v-if="totalCount === 0">
      <NoResults />
    </div>
    <div v-else>
      <transition name="fade">
        <component :is="componentToShow" />
      </transition>
      <div class="overflow-auto text-center mt-5" v-if="pages > 1">
        <div class="d-flex justify-content-center">
          <b-pagination-nav
            :link-gen="paginationLink"
            :number-of-pages="pages"
            :value="$route.query.page || 1"
            @change="$store.dispatch('search/search', $route)"
          ></b-pagination-nav>
        </div>
        <small v-if="showWirePageLimit">WIRe is limited to 50 pages</small>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Compact from "./compact/Compact";
import Cozy from "./cozy/Cozy";
import Visuals from "./visuals";
import NoResults from "./NoResults";
import Spinner from "../shared/Spinner";

export default {
  name: "Results",
  components: { NoResults, Spinner },
  computed: {
    ...mapState("search", ["loading", "compact", "pages", "totalCount"]),

    componentToShow() {
      let viewMap = {
        list: Compact,
        grid: Cozy,
        visuals: Visuals,
      };

      let urlView = this.$route.query?.view;
      return urlView ? viewMap[urlView] : Compact;
    },

    showWirePageLimit() {
      return this.$route.query.page && this.$route.query.page >= 40;
    },
  },

  methods: {
    paginationLink(pageNum) {
      var query = Object.assign({}, this.$route.query);
      query.page = pageNum;
      return {
        name: this.$route.name,
        query: query,
      };
    },
  },

  mounted() {
    // Handle legacy view routes
    // 3/1/2021 we have updated the view routes to use view=list/grid/visuals
    // However we cannot update peoples bookmarks which may still use the old
    // list=list, grid=grid, visuals=visuals layout
    if (
      this.$route.query?.list ||
      this.$route.query?.grid ||
      this.$route.query?.visuals
    ) {
      let query = Object.assign({}, this.$route.query);
      if (this.$route.query?.list) {
        query.view = this.$route.query.list;
      } else if (this.$route.query?.grid) {
        query.view = this.$route.query.grid;
      } else if (this.$route.query?.visuals) {
        query.view = this.$route.query.visuals;
      }

      delete query.list;
      delete query.grid;
      delete query.visuals;

      this.$router.push({ query });
    }
  },
};
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
