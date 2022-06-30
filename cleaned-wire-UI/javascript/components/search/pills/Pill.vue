<template>
  <b-button
    :aria-label="
      'deselect ' +
      query.replace('[]', '').replace(/_/g, ' ') +
      ' ' +
      specificCriteria.name
    "
    v-if="specificCriteria || !mappedName"
    :disabled="isVanityPill"
    variant="light"
    class="pill"
    @click="clearPill"
  >
    <span v-if="mappedName">
      {{ specificCriteria.name }}
    </span>
    <span v-else>
      <span v-if="criteriaName === 'text'" class="double-emphasis"
        >Keywords:</span
      >
      <span v-if="criteriaName === 'title'" class="double-emphasis"
        >Title:</span
      >
      <span v-if="criteriaName === 'poa_product'" class="double-emphasis"
        >_temp_190:</span
      >
      <span v-if="criteriaName === 'us_person_info'" class="double-emphasis"
        >USPER:</span
      >
      {{ formattedQueryValue }}
    </span>
    <img
      v-if="criteriaName === 'text'"
      :src="require('@assets/edit.svg')"
      alt="edit keyword"
      class="edit-icon ml-2 mr-1 mt-1 mb-2"
    />
    <img
      :src="require('@assets/delete-icon.svg')"
      class="delete-icon ml-2 mt-1 mb-2"
      v-else
    />
  </b-button>
</template>

<script>
import urlStore from "@shared/mixins/urlStore";
import { camelCase, find } from "lodash";
import { mapState } from "vuex";

export default {
  name: "Pill",
  mixins: [urlStore],
  props: {
    criteriaName: {},
    addToQuery: {
      default: false,
    },
  },

  methods: {
    clearPill() {
      if (this.criteriaName === "text") {
        this.$bus.$emit("editKeyword", this.formattedQueryValue);
      }
      this.removeFromQueryParams();
    },
  },

  computed: {
    ...mapState("metadata", ["criteria"]),
    ...mapState("metadata/criteria", ["loading"]),

    category() {
      if (this.loading) {
        return;
      }
      var criteriaSet = this.criteria[camelCase(this.criteriaName)];
      if (criteriaSet) {
        return criteriaSet.values;
      }
    },

    formattedQueryValue() {
      return this.queryValue.replace(/_/g, " ");
    },

    isVanityPill() {
      if (this.specificCriteria) {
        switch (this.$route.name) {
          case "countries":
            return (
              this.$route.params.countryName === this.specificCriteria.name
            );
          case "regions":
            return this.$route.params.regionName === this.specificCriteria.name;
          case "subregions":
            return (
              this.$route.params.subregionName === this.specificCriteria.name
            );
          case "issues":
            return this.$route.params.issueName === this.specificCriteria.name;
        }
      }
    },

    specificCriteria() {
      var qV = this.queryValue;
      if (this.category) {
        return find(this.category, function (v) {
          return String(v.code) === String(qV);
        });
      } else {
        return { name: qV };
      }
    },

    mappedName() {
      return ![
        "text",
        "title",
        "dateRange",
        "doc_num",
        "classifications[]",
        "selected_for[]",
        "other[]",
        "poa_product",
        "us_person_info",
      ].includes(this.query);
    },
  },
};
</script>

<style scoped lang="scss">
.pill.disabled {
  background-color: $alt-300;
  opacity: 1;
  .fa-times {
    display: none;
  }
}
.edit-icon {
  height: 12px;
  width: 12px;
}
.delete-icon {
  height: 8px;
  width: 8px;
}
</style>
