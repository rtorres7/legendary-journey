<template>
  <b-col cols="10" lg="6" class="pl-5 pb-5" id="feedback_search_criteria">
    <h2 class="mt-6">Narrow Criteria</h2>

    <b-form @submit="onSubmit" @reset="onReset">
      <label>Reporting Types</label>
      <div class="mb-3">
        <multiselect
          v-model="selectedReportingTypes"
          :multiple="true"
          :options="reportingTypes"
          label="name"
          track-by="value"
          @select="reportingTypeSelected"
          @remove="reportingTypeRemoved"
        ></multiselect>
      </div>

      <label class="pt-5">Produced By</label>
      <div class="mb-3">
        <multiselect
          v-model="selectedProducingOffices"
          :multiple="true"
          :options="groupedProducingOffices"
          group-label="mission"
          group-values="producingOffices"
          label="name"
          track-by="value"
          @select="producingOfficeSelected"
          @remove="producingOfficeRemoved"
        ></multiselect>
      </div>

      <label class="pt-5">Product Types</label>
      <div class="mb-3">
        <multiselect
          v-model="selectedProductTypes"
          :multiple="true"
          :options="groupedProductTypes"
          group-label="reportingType"
          group-values="productTypes"
          label="name"
          track-by="value"
          @select="productTypeSelected"
          @remove="productTypeRemoved"
        ></multiselect>
      </div>

      <label class="pt-5">Comment Status</label>
      <b-form-select
        v-model="selectedCommentStatus"
        :options="commentStatusCriteria"
      >
      </b-form-select>

      <label class="pt-5">Countries</label>
      <multiselect
        v-model="selectedCountries"
        :options="countries"
        :multiple="true"
        label="name"
        track-by="code"
        @select="countrySelected"
        @remove="countryRemoved"
      >
      </multiselect>

      <b-form-checkbox v-model="excludeWorldwide" class="pt-4">
        <label>Exclude Worldwide</label>
      </b-form-checkbox>

      <label class="pt-5">Topics/NIPF</label>
      <multiselect
        v-model="selectedTopics"
        :multiple="true"
        :options="groupedTopics"
        group-label="topicGroup"
        group-values="topics"
        label="name"
        track-by="value"
        @select="topicSelected"
        @remove="topicRemoved"
      ></multiselect>

      <label class="pt-5">Comment Date</label>
      <b-form-select
        v-model="selectedCommentDateOption"
        :options="commentDateOptions"
      >
      </b-form-select>

      <b-row class="d-flex align-items-center">
        <b-col cols="md-3" class="mr-4">
          <DatePicker
            class="pt-4"
            title=""
            @datesSelected="datesSelected"
            v-if="selectedCommentDateOption == 'between'"
          />
        </b-col>
        <b-col
          class="pt-4"
          v-if="
            selectedCommentDateOption == 'between' &&
            selectedCommentFromDate !== null &&
            selectedCommentFromDate !== undefined
          "
        >
          <label class="pt-4">
            <span class="pr-4">Start {{ selectedCommentFromDate }}</span> End
            {{ selectedCommentToDate }}
          </label>
        </b-col>
      </b-row>

      <b-row class="d-flex pt-3 px-2">
        <b-btn variant="primary" type="submit">Search</b-btn>
        <b-btn class="ml-3" variant="secondary" type="reset">Reset</b-btn>
      </b-row>
    </b-form>
  </b-col>
</template>

<script>
import DatePicker from "../search/criteria/DatePicker";
import Multiselect from "vue-multiselect";
import { mapGetters } from "vuex";

export default {
  name: "ReviewDocumentFeedbackFilters",
  components: {
    Multiselect,
    DatePicker,
  },
  data() {
    return {
      selectedTopics: [],
      selectedCommentStatus: "",
      selectedProductTypes: [],
      selectedProducingOffices: [],
      selectedCountries: [],
      selectedReportingTypes: null,
      selectedCommentDateOption: "any",
      selectedCommentFromDate: null,
      selectedCommentToDate: null,
      excludeWorldwide: false,
      commentDateOptions: [
        { value: "any", text: "Anytime" },
        { value: "between", text: "Between the dates.." },
      ],
    };
  },
  mounted() {
    this.selectedCommentStatus = this.$route.query.status_filter;
    this.setSearchCriteria();
  },
  computed: {
    ...mapGetters("documentFeedbacks", [
      "statusOptions",
      "reportingTypes",
      "productTypes",
      "producingOffices",
      "countries",
      "topics",
    ]),
    commentStatusCriteria() {
      return [
        {
          text: "(Any comment Status Selected)",
          value: null,
        },
      ].concat(this.statusOptions);
    },
    groupedProductTypes() {
      let productTypeOptions = [];
      productTypeOptions = this.productTypes.map((productType) => {
        let reportingType = productType[0].reporting_type;
        let productTypes = productType[1].product_types.map((productType) => {
          return { name: productType[0].name, value: productType[1].code };
        });
        return { reportingType: reportingType, productTypes: productTypes };
      });
      return productTypeOptions;
    },
    groupedTopics() {
      let topicOptions = [];
      topicOptions = this.topics.map((topic) => {
        let topicGroup = topic[0].topic_group;
        let topics = topic[1].topics.map((topic) => {
          return { name: topic[0].name, value: topic[1].code };
        });
        return { topicGroup: topicGroup, topics: topics };
      });
      return topicOptions;
    },
    groupedProducingOffices() {
      let producingOfficeOptionValues = this.producingOffices.reduce(function (
        producingOfficeOptions,
        producingOffice
      ) {
        if (producingOffice[0] !== "Other") {
          let mission = producingOffice[0];
          let producingOffices = producingOffice[1].map((producingOffice) => {
            return {
              name: producingOffice[0],
              value: producingOffice[1],
            };
          });
          producingOfficeOptions = producingOfficeOptions.concat({
            mission: mission,
            producingOffices: producingOffices,
          });
        }
        return producingOfficeOptions;
      },
      []);
      return producingOfficeOptionValues;
    },
    selectedReportingTypeValues() {
      return this.selectedReportingTypes == null
        ? []
        : this.selectedReportingTypes.map(
            (reportingType) => reportingType.value
          );
    },
    selectedProductTypeValues() {
      return this.selectedProductTypes.map((productType) => productType.value);
    },
    selectedTopicValues() {
      return this.selectedTopics.map((topic) => topic.value);
    },
    selectedCountryCodes() {
      return this.selectedCountries.map((country) => country.code);
    },
    selectedProducingOfficeValues() {
      return this.selectedProducingOffices.map(
        (producingOffice) => producingOffice.value
      );
    },
    buildSearchCriteria() {
      return {
        searchfor: {
          start_date: this.selectedCommentFromDate,
          end_date: this.selectedCommentToDate,
          topics: this.selectedTopicValues,
          worldwide: this.excludeWorldwide ? "exclude" : "include",
          countries: this.selectedCountryCodes,
          reporting_types: this.selectedReportingTypeValues,
          product_types: this.selectedProductTypeValues,
          producers: this.selectedProducingOfficeValues,
          daterangetype: this.selectedCommentDateOption,
          status: this.selectedCommentStatus,
        },
      };
    },
  },
  methods: {
    setSearchCriteria() {
      this.$store.dispatch("documentFeedbacks/setSearchCriteria", {
        caller: this,
      });
    },
    multiSelectOptionChanged(action, type, value) {
      this.$announcer.set(`${action} ${type} ${value}`);
    },
    countryRemoved(country) {
      this.multiSelectOptionChanged("Removed", "country", country.name);
    },
    countrySelected(country) {
      this.multiSelectOptionChanged("Selected", "country", country.name);
    },
    topicRemoved(topic) {
      this.multiSelectOptionChanged("Removed", "topic", topic.name);
    },
    topicSelected(topic) {
      this.multiSelectOptionChanged("Selected", "topic", topic.name);
    },
    productTypeRemoved(productType) {
      this.multiSelectOptionChanged(
        "Removed",
        "product type",
        productType.name
      );
    },
    productTypeSelected(productType) {
      this.multiSelectOptionChanged(
        "Selected",
        "product type",
        productType.name
      );
    },
    producingOfficeRemoved(producedBy) {
      this.multiSelectOptionChanged(
        "Removed",
        "producing office",
        producedBy.name
      );
    },
    producingOfficeSelected(producedBy) {
      this.multiSelectOptionChanged(
        "Selected",
        "producing office",
        producedBy.name
      );
    },
    reportingTypeRemoved(reportingType) {
      this.multiSelectOptionChanged(
        "Removed",
        "reporting type",
        reportingType.name
      );
    },
    reportingTypeSelected(reportingType) {
      this.multiSelectOptionChanged(
        "Selected",
        "reporting type",
        reportingType.name
      );
    },
    datesSelected(startDate, endDate) {
      this.selectedCommentFromDate = startDate;
      this.selectedCommentToDate = endDate;
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$route.query.page = 1;
      this.$router.push({
        name: "feedback_reviews",
      });

      this.setSearchCriteria();
      this.$store
        .dispatch("documentFeedbacks/search", {
          caller: this,
        })
        .then(() => {
          this.$announcer.set("displaying document feedback search results");
          this.$bus.$emit("searchPerformed");
        });
    },
    onReset(evt) {
      this.$route.query.page = 1;
      this.$router.push({
        name: "feedback_reviews",
      });

      this.selectedCommentStatus = null;
      this.selectedReportingTypes = [];
      this.selectedProductTypes = [];
      this.selectedTopics = [];
      this.selectedProducingOffices = [];
      this.selectedCommentDateOption = "any";
      this.selectedCommentFromDate = null;
      this.selectedCommentToDate = null;
      this.selectedCountries = [];
      this.setSearchCriteria();
      this.$store.dispatch("documentFeedbacks/search", {
        caller: this,
      });
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

::v-deep .multiselect__tags {
  border-color: #8e929f;
}

::v-deep .multiselect__placeholder {
  color: #6a737b;
}

::v-deep .multiselect__tag {
  background-color: $alt-300;
  color: #333;
}

::v-deep .multiselect__option--highlight {
  background-color: $alt-300;
  color: #333;
}

::v-deep .multiselect__option::after {
  background-color: $alt-300;
  color: #333;
}

::v-deep .multiselect__tag-icon {
  &:focus,
  &:hover {
    background-color: $alt-300;
  }
  &:after {
    color: $alt-800;
  }
}
</style>
