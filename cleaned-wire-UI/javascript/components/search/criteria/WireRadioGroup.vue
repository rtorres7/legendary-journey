<template>
  <b-col class="flex-grow-1">
    <b-form-group
      :label="label"
      label-cols-xl="7"
      label-cols-lg="9"
      label-cols-md="20"
      label-cols-sm="7"
      label-cols="6"
      v-slot="{ ariaDescribedby }"
    >
      <b-form-radio-group
        buttons
        button-variant="outline-nav"
        v-model="selectedValue"
        size="sm"
        :options="optionsToUse"
        :aria-label="label"
      />
    </b-form-group>
  </b-col>
</template>

<script>
import { isEmpty } from "lodash";
import urlStore from "@shared/mixins/urlStore";

export default {
  name: "WireRadioGroup",
  props: {
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      default() {
        return [
          { text: "Yes", value: "true" },
          { text: "No", value: "false" },
        ];
      },
    },
  },
  mixins: [urlStore],
  data() {
    return {
      selectedValue: null,
      optionsToUse: [],
    };
  },
  mounted() {
    this.optionsToUse = this.options;
    if (this.fieldIncludedInParams) {
      this.selectedValue = this.$route.query[this.query];
    }
  },
  computed: {
    fieldIncludedInParams() {
      return this.$route.query && this.$route.query[this.query];
    },
  },
  watch: {
    $route() {
      if (
        !this.fieldIncludedInParams ||
        isEmpty(this.$route.query[this.query])
      ) {
        this.selectedValue = "";
      }
    },
    selectedValue() {
      if (this.selectedValue === "") {
        return;
      }
      // add/update query params with selected value
      if (this.fieldIncludedInParams) {
        let query = Object.assign({}, this.$route.query);
        query[this.query] = this.selectedValue;
        this.$router.push({ query });
      } else {
        this.addToQueryParams(this.query, this.selectedValue);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../../assets/stylesheets/variables_and_mixins";
</style>
