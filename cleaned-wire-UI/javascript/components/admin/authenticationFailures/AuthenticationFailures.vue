<template>
  <div class="mt-6 standard-page-margin">
    <vanity-title title="Authentication Failures" />
    <b-form @submit.prevent="onFilter">
      <b-form-group>
        <b-row class="align-items-end mt-6">
          <b-col cols="6">
            <label>_temp_39</label>
            <b-input
              id="_temp_39-input"
              aria-label="Filter by _temp_39 on"
              v-model="filterText"
              autofocus
            />
          </b-col>
          <b-btn variant="primary" type="submit">Filter </b-btn>
        </b-row>
      </b-form-group>
    </b-form>
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center loading-area"
    >
      Loading results ...
      <spinner />
    </div>

    <b-table
      v-else
      headVariant="light"
      hover
      :items="failures"
      :fields="fields"
    >
      <template #cell(created_at)="data">
        {{ formatTimeStamp(data.item.created_at) }}
      </template>
      <template #cell(id)="data">
        <router-link
          :to="{
            name: 'authenticationFailureDetails',
            params: { id: data.value },
          }"
        >
          <img
            :alt="`View Authentication Report link for user ID ${data.item.user_id}`"
            :src="require('@assets/review-icon.svg')"
            class="review-icon"
          />
        </router-link>
      </template>
      <template #cell(user_id)="data">
        <router-link :to="'/admin/users/' + data.value">
          {{ data.value }}
        </router-link>
      </template>
      <template #cell()="data">
        <span>{{ data.value }}</span>
      </template>
      <template #head()="data">
        <span class="authentication-header">{{ data.label }}</span>
      </template>
    </b-table>
    <div class="overflow-auto text-center mt-5 pb-6" v-if="pages > 1">
      <div class="d-flex justify-content-center">
        <b-pagination
          :total-rows="rows"
          :per-page="perPage"
          v-model="currentPage"
          @change="pageResults"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Spinner from "../../shared/Spinner";
import VanityTitle from "../../vanity/VanityTitle";

export default {
  name: "AuthenticationFailures",
  components: {
    VanityTitle,
    Spinner,
  },
  data() {
    return {
      failures: [],
      pages: 0,
      perPage: 25,
      rows: 0,
      filterText: "",
      currentPage: 1,
      loading: true,
      fields: [
        { key: "created_at", label: "Failure Date" },
        { key: "user_id", label: "User ID" },
        { key: "user_identifier", label: "_temp_39" },
        { key: "uri", label: "URI" },
        { key: "error_messages", label: "Error Message" },
        { key: "id", label: "Review" },
      ],
    };
  },
  mounted() {
    this.getFailures();
  },
  methods: {
    formatTimeStamp(dateTime) {
      return this.$moment(dateTime, "YYYY/MM/DD hh:mm:ss ZZ").format(
        "YYYY-MM-DD HH:mm"
      );
    },
    onFilter() {
      this.currentPage = 1;
      this.getFailures();
    },
    pageResults(p) {
      this.currentPage = p;
      this.getFailures();
    },
    getFailures() {
      this.loading = true;
      this.failures = [];
      axios
        .get(
          `/admin/authentication_failures?page=${this.currentPage}&_temp_39=${this.filterText}`
        )
        .then((response) => {
          this.failures = response.data.failures;
          this.rows = response.data.failure_count;
          this.perPage = response.data.per_page;
          this.pages = response.data.failure_count / response.data.per_page;
          if (document.querySelector("#_temp_39-input")) {
            document.querySelector("#_temp_39-input").focus();
          }
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped lang="scss">
.authentication-header {
  color: $alt-900;
  text-transform: uppercase;
  font-weight: 500;
}
.row-separator {
  border-bottom: 2px solid $alt-400;
  margin-bottom: 5px;
}
.results {
  color: $alt-800;
  line-height: 1;
  margin-bottom: unset;
}
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
.contact-link {
  text-decoration: underline;
}
.subhead {
  color: $alt-800;
  text-transform: uppercase;
}
.user-id {
  font-family: $heading-stylized;
  font-size: $font-size-4;
}
._temp_39 {
  font-size: $font-size-2;
  font-family: "Roboto Condensed";
  color: $pri-600;
  text-transform: uppercase;
}
.review-icon {
  height: 32px;
  width: 32px;
}
</style>
