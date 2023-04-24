<template>
  <div>
    <label v-if="!hideLabel" class="nowrap-label"> {{ label }} </label>
    <vue-typeahead-bootstrap
      :data="selectableOptions"
      :serializer="(s) => s.text"
      :placeholder="placeholder"
      :aria-label="`${placeholder} input` || 'search input'"
      v-model="selectedOption"
      :disabledValues="disabledValues"
      :min-matching-chars="0"
      :show-on-focus="true"
      size="sm"
      ie-close-fix
      :max-matches="selectableOptions.length"
      @hit="selectSelected"
    >
      <template slot="suggestion" slot-scope="{ data, htmlText }">
        <div
          class="pl-4 py-1 font-size-2"
          :class="{
            'pl-6': data.indent,
            'text-bold': data.children || data.header,
            disabled: data.header,
          }"
          :data-usage="dataUsageMetricsInfo(data)"
        >
          <span v-html="htmlText"></span>
        </div>
      </template>
    </vue-typeahead-bootstrap>
    <span class="fa fa-angle-down"></span>
  </div>
</template>

<script>
import urlStore from "@shared/mixins/urlStore";
import { isEmpty, uniq, camelCase } from "lodash";
import { mapState } from "vuex";

export default {
  name: "WireSelect",
  props: {
    options: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    hideLabel: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [urlStore],
  data() {
    return {
      selectedOption: null,
    };
  },
  computed: {
    ...mapState("metadata", {
      criteria: "criteria",
      metadataLoading: "loading",
    }),

    placeholder() {
      return this.label.toLowerCase();
    },

    selectableOptions() {
      let opts = this.options.filter((opt) => !opt.label);

      return opts;
    },

    disabledValues() {
      // This method needs to parse the _temp_1 to find strings that are selected so we can disable them

      if (isEmpty(this.options) || this.metadataLoading) {
        return [];
      }

      // First we need to programmatically grab the types from the list of options, for instance
      // for regions/subregions dropdown we could have both regions[], and subregions[]
      const types = uniq(this.options.map((opt) => opt.type));

      // now we can iterate over each type to disable those items
      return types.flatMap((type) => {
        let items = this.$route.query[type];
        if (!items) {
          return [];
        }
        if (!Array.isArray(items)) {
          // we want to map in a minute, so lets force items to be an array
          // if there is only 1 item for a type it is a string not an array by default
          items = [items];
        }
        // exclude selected option so that vue-typeahead-bootstrap does not autoselect first option
        items = items.filter((i) => i !== this.selectedOption);

        // some metatypes do not match our criteria exactly for instance selected_for and selectedFor
        const metadata = this.criteria[camelCase(type.replace("[]", ""))]
          .values;

        // for each item in the _temp_1, lets grab the appropriate item from our stores criteria,
        // so we can get the correct name
        return items.map((item) => {
          try {
            return metadata.find((metaItem) => item === metaItem.code).name;
          } catch {
            return;
          }
        });
      });
    },
  },

  methods: {
    selectSelected() {
      const selectedOpt = this.options.find(
        (opt) => opt.text === this.selectedOption
      );
      if (!selectedOpt.header) {
        this.addToQueryParams(selectedOpt.type, selectedOpt.value);
      }

      this.$nextTick(() => {
        // Delay clearing value for a second so that the first option
        // is not autoselected on hitting enter key after typing ahead
        setTimeout(() => {
          this.selectedOption = "";
        }, 1000);
      });
    },
    dataUsageMetricsInfo(data) {
      // Slashes in the _temp_1 causes problems and text after a dot is consider the format type by rails
      let encodedText = encodeURIComponent(
        `${data.value}(${data.text})`.replace(/\//g, "|")
      );
      return `wire-select-${data.type}-${encodedText}`.replace(/\./g, "_");
    },
  },
};
</script>

<style scoped lang="scss">
.nowrap-label {
  white-space: nowrap;
}

::v-deep .list-group {
  margin-top: 12px;
}

::v-deep .list-group-item {
  padding: 0;
}

::v-deep input::placeholder {
  color: $text-light;
}

.fa-angle-down {
  color: $alt-800;
  position: absolute;
  right: 15px;
  top: 37px;
  z-index: 3; // caret gets hidden by typeahead options when you click the input field
  pointer-events: none;
}
</style>
