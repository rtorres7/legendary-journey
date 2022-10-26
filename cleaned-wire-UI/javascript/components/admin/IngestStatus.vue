<template>
  <div class="mt-6 standard-page-margin">
    <div v-if="hasError">
      <NotFound />
    </div>
    <div v-else>
      <vanity-title class="mb-6" title="Ingest Status" />
      <b-row>
        <b-tabs class="mb-6" v-model="tabIndex">
          <b-tab title="In Progress" @click="changeTab(0)"></b-tab>
          <b-tab title="Pending" @click="changeTab(1)"></b-tab>
          <b-tab title="Completed" @click="changeTab(2)"></b-tab>
        </b-tabs>
      </b-row>

      <b-row class="d-flex align-items-center">
        <label class="ml-3">Per Page </label>
        <b-col cols="2"
          ><b-select v-model="perPageCount" @change="handlePageCountChange">
            <b-select-option value="10">10</b-select-option>
            <b-select-option value="25">25</b-select-option>
            <b-select-option value="50">50</b-select-option>
            <b-select-option value="100">100</b-select-option>
          </b-select></b-col
        >
        <label class="ml-6">Search</label>
        <b-col cols="8"
          ><b-input @input="handleSearchText" v-model="searchText" trim
        /></b-col>
      </b-row>
      <div
        v-if="loading"
        class="d-flex justify-content-center align-items-center loading-area"
      >
        <spinner />
      </div>
      <b-container class="mt-6" fluid v-else>
        <b-table
          hover
          headVariant="light"
          no-local-sorting
          no-sort-reset
          :items="items"
          :fields="fields"
          @sort-changed="handleSort"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
        >
          <template #head()="data">
            <span class="table-header">{{ data.label }}</span>
          </template>
          <template #cell(job_admin_links)="data">
            <span class="text-nowrap" v-html="getCellValue(data)" />
          </template>
          <template #cell()="data">
            <span v-html="getCellValue(data)" />
          </template>
        </b-table>
        <div class="overflow-auto text-center mt-5 pb-6" v-if="pages > 1">
          <div class="d-flex justify-content-center">
            <b-pagination-nav
              :link-gen="paginationLink"
              :number-of-pages="this.pages"
              @change="loadIngestStatus"
              v-model="currentPageNum"
            ></b-pagination-nav>
          </div>
        </div>
        <b-row> </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NotFound from "@shared/errors/NotFound";
import Spinner from "../shared/Spinner";
import VanityTitle from "../vanity/VanityTitle";

export default {
  name: "IngestStatus",
  components: {
    VanityTitle,
    Spinner,
    NotFound,
  },
  data() {
    return {
      pages: 1,
      currentPage: 1,
      loading: true,
      fields: [],
      items: [],
      tabIndex: parseInt(this.$route.query.tabIndex) || 0,
      sortBy: null,
      sortDesc: true,
      searchText: null,
      searchTextTimeout: null,
      perPageCount: 10,
      hasError: null,
    };
  },
  mounted() {
    this.loadIngestStatus();
  },
  computed: {
    ingestStatus() {
      switch (this.tabIndex) {
        case 0:
          return "working";
        case 1:
          return "pending";
        case 2:
          return "completed";
      }
    },
  },
  methods: {
    setQueryParams(pageNum) {
      this.$router
        .push({
          query: {
            tabIndex: this.tabIndex,
            page: pageNum || this.$route.query.page || 1,
          },
        })
        .catch(() => {});
    },
    loadIngestStatus(pageNum) {
      this.setQueryParams(pageNum);
      this.loading = true;
      axios
        .get("/admin/ingest", {
          params: {
            page: this.$route.query.page,
            pageToLoad: this.ingestStatus,
            sortBy: this.sortBy,
            sortDesc: this.sortDesc,
            searchText: this.searchText,
            perPageCount: this.perPageCount,
          },
        })
        .then((response) => {
          this.hasError = false;
          this.fields = response.data.fields;
          this.items = response.data.data;
          this.pages = response.data.pageCount;
          this.currentPageNum = response.data.currentPageNum;
          this.loading = false;
          this.fields.map((field) => {
            if (field.label === "Admin") {
              field.thStyle = { width: "40px" };
            }
            if (field.label === "Description" || field.label === "Error") {
              field.thStyle = { width: "100px" };
            }
          });
        })
        .catch(() => {
          this.hasError = true;
        });
    },
    getCellValue(data) {
      if (data.field.isDate) {
        return this.formatDate(data.value);
      } else {
        return data.value;
      }
    },
    formatDate(dateStr) {
      var date = this.$moment(dateStr, "YYYY/MM/DD hh:mm:ss ZZ");
      return date.isValid() ? date.format("YYYY-MM-DD HH:mm") : dateStr;
    },
    handleSort(sort) {
      this.sortBy = sort.sortBy;
      this.sortDesc = sort.sortDesc;
      this.loadIngestStatus(1);
    },
    handleSearchText() {
      clearTimeout(this.searchTextTimeout);
      this.searchTextTimeout = setTimeout(() => {
        this.loadIngestStatus(1);
      }, 700);
    },
    handlePageCountChange(count) {
      this.perPageCount = count;
      this.loadIngestStatus();
    },
    changeTab(tabIndex) {
      this.tabIndex = tabIndex;
      this.sortBy = null;
      this.sortDesc = true;
      this.searchText = null;
      this.loadIngestStatus(1);
    },
    paginationLink(pageNum) {
      return { query: { page: pageNum } };
    },
  },
};
</script>

<style scoped lang="scss">
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}

::v-deep table a {
  padding: 4px;
}
</style>
