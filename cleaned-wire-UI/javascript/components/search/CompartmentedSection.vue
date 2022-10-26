<template>
  <div class="compartmented">
    <div class="standard-page-margin pt-5 pb-5">
      <h3 class="sr-only">Sensitive Results</h3>
      <b-row>
        <b-col class="my-auto"> </b-col>
        <b-col class="my-auto separator pb-2" md="4" align="center">
          <div v-if="loading">Loading Sensitive Results....</div>
          <div v-else>{{ total }} Sensitive Results</div>
        </b-col>
        <b-col class="my-auto" align="right">
          <div class="d-flex justify-content-end">
            <b-dropdown variant="link" :text="'Sort by ' + sortOrder">
              <b-dropdown-item
                v-for="(option, ind) in searchOrderOpts"
                @click="setSortOrder(option.value)"
                :key="ind"
                :value="option.value"
              >
                {{ option.text }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="20" lg="16">
          <div class="standard-page-margin">
            <div v-for="article in results" :key="article.id">
              <CompartmentedCard :document="article" />
            </div>
          </div>
        </b-col>
        <b-col offset-lg="2" cols="4" lg="6">
          <!-- Facets for FSS -->
        </b-col>
      </b-row>
      <div class="overflow-auto text-center mt-4">
        <div class="d-flex justify-content-center" v-if="pages > 1">
          <b-pagination
            :total-rows="total"
            :per-page="perPage"
            v-model="currentPage"
            @change="pageResults"
          ></b-pagination>
        </div>
      </div>
      <HuiModal />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CompartmentedCard from "./compact/CompartmentedCard";
import HuiModal from "../home/sensitive/HuiModal";

export default {
  name: "CompartmentedSection",
  components: {
    CompartmentedCard,
    HuiModal,
  },
  data() {
    return {
      loading: true,
      total: 0,
      results: [],
      sortOrder: this.getSortOrder(),
      searchOrderOpts: [
        { text: "Newest", value: "Newest" },
        { text: "Oldest", value: "Oldest" },
      ],
      pages: 0,
      perPage: 50,
      currentPage: 1,
    };
  },

  methods: {
    notify() {
      let message = `${this.total} Sensitive Results`;
      this.$announcer.set(message);
    },
    getSortOrder() {
      if (this.$route.query.fsort_dir === "asc") {
        return "Oldest";
      } else {
        return "Newest";
      }
    },
    setSortOrder(value) {
      this.sortOrder = value;
      var query = this.clearSearchOrder();
      if (value == "Oldest") {
        query["fsort_dir"] = "asc";
      } else {
        query["fsort_dir"] = "desc";
      }
      this.$router.push({ query });
    },
    clearSearchOrder() {
      let query = Object.assign({}, this.$route.query);
      delete query.fsort_dir;
      return query;
    },
    clearResults() {
      this.results = [];
      this.total = 0;
      this.pages = 0;
      this.$bus.$emit("countUpdateFSS", "Loading...");
    },
    resultsBasedOnRoute() {
      this.loading = true;
      this.clearResults();
      axios
        .get("/fss", {
          params: this.$route.query,
        })
        .then((response) => {
          this.results = response.data.items;
          this.total = response.data.total;
          this.$bus.$emit("countUpdateFSS", this.total);
          this.perPage = response.data.per_page;
          this.pages = response.data.total / this.perPage;
          this.loading = false;
          this.notify();
        })
        .catch((e) => {
          this.loading = false;
          this.$bus.$emit("countUpdateFSS", this.total);
          console.error("FSS error. " + e);
        });
    },
    pageResults(p) {
      this.currentPage = p;
      let query = Object.assign({}, this.$route.query);
      query["fpage"] = this.currentPage;
      this.$router.push({ query });
    },
  },
  mounted() {
    this.resultsBasedOnRoute();
  },
  watch: {
    $route() {
      this.resultsBasedOnRoute();
    },
  },
};
</script>

<style scoped lang="scss">
.compartmented {
  background-color: $pri-100;
}
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
::v-deep .btn,
.btn:focus {
  border-radius: unset;
}
.btn-group {
  padding-left: 1rem;
}
.form-group {
  margin: 0;
}
.separator {
  border-bottom: 1px solid $pri-300;
}
</style>
