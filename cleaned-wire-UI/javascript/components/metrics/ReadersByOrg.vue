<template>
  <div class="card">
    <div class="card-header text-normal">
      <h3>Unique Readers, by Organization</h3>
    </div>
    <div class="card-body">
      <b-row>
        <b-col>
          <b-form-group
            label="Per Page"
            label-for="per-page-select"
            label-cols-sm="6"
            label-cols-md="4"
            label-cols-lg="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0 text-nowrap"
          >
            <b-form-select
              id="per-page-select"
              v-model="perPage"
              :options="[10, 25, 50, 100]"
              size="sm"
              class="w-50"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            label="Filter"
            label-for="filter-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
          >
            <b-input-group size="sm">
              <b-form-input
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Type to Search"
              ></b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-table
        striped
        hover
        id="readers-by-org"
        :items="items"
        :fields="fields"
        :filter="filter"
        :current-page="currentPage"
        :per-page="perPage"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        show-empty
        @filtered="onFiltered"
      ></b-table>
      <b-row class="d-flex justify-content-center" v-if="totalRows > perPage">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          aria-controls="readers-by-org"
        ></b-pagination>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReadersByOrg",
  data() {
    return {
      currentPage: 1,
      perPage: 10,
      filter: null,
      sortBy: "count",
      sortDesc: true,
      totalRows: 1,
      fields: [
        {
          key: "derived_org",
          label: "Organization",
          sortable: true,
        },
        {
          key: "count",
          label: "Readers",
          sortable: true,
        },
        {
          key: "category",
          label: "Market Segment",
          sortable: true,
        },
      ],
    };
  },
  props: ["data"],
  mounted() {
    this.totalRows = this.items.length;
  },
  computed: {
    items() {
      return this.data;
    },
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>
