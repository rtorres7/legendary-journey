<template>
  <span class="pr-4 mr-4 pill-group">
    <span v-if="valueAsArray.length > 0">
      <b-button
        v-if="valueAsArray.length > 3 && !expanded"
        :aria-label="
          'expand ' + valueAsArray.length + ' selected ' + pillData.name
        "
        variant="light"
        @click="expanded = true"
        class="pill badge badge-pill multiple-selection-pill"
      >
        <span class="double-emphasis">{{ valueAsArray.length }} selected</span>
        {{ startCasedName }}
        <img
          :src="require('@assets/add-icon.svg')"
          class="add-icon ml-2 mt-1 mb-2"
        />
      </b-button>
      <span v-else>
        <span
          v-for="(value, ind) in valueAsArray"
          :key="ind"
          v-if="pillData.name !== 'dateRange'"
          class="pill-container"
        >
          <div class="d-inline-flex">
            <Pill
              :query="pillData.query"
              :queryValue="value"
              :addToQuery="addToQuery"
              :criteria-name="pillData.name"
              class="badge badge-pill"
              :class="{ 'badge-accent': addToQuery }"
            ></Pill>
            <b-button
              v-if="ind < valueAsArray.length - 1 && !addToQuery"
              class="py-0 px-2"
              @click="andOrToggle"
              @keyup.enter="andOrToggle"
              :disabled="!andable"
              variant="link"
              data-usage="boolean-toggle"
            >
              <span :class="{ orOnly: !andable }">{{ andOrBool }}</span>
            </b-button>
          </div>
        </span>
        <Pill
          v-if="pillData.name === 'dateRange'"
          query="dateRange"
          :queryValue="pillData.value"
          :addToQuery="false"
          criteria-name="dateRange"
          class="badge badge-pill"
        ></Pill>
      </span>
    </span>
  </span>
</template>

<script>
import Pill from "./Pill";
import { mapState } from "vuex";
import { camelCase, startCase } from "lodash";

export default {
  name: "PillGroup",
  components: { Pill },
  computed: {
    ...mapState("metadata", ["criteria"]),
    ...mapState("metadata/criteria", ["loading"]),

    valueAsArray() {
      if (Array.isArray(this.pillData.value)) {
        return this.pillData.value;
      } else {
        return [this.pillData.value];
      }
    },

    boolName() {
      return this.pillData.name + "_bool";
    },

    startCasedName() {
      return startCase(this.pillData.name);
    },

    andOrBool() {
      if (this.valueAsArray.length > 1) {
        return this.$route.query[this.boolName] || "or";
      }
      return "or";
    },

    andable() {
      return this.criteria[camelCase(this.pillData.name)].andable;
    },
  },
  data() {
    return {
      expanded: false,
    };
  },
  props: {
    addToQuery: {
      default: false,
    },
    pillData: {},
    collapsible: {
      default: true,
    },
  },

  mounted() {
    this.expanded = !this.collapsible;
  },

  methods: {
    andOrToggle() {
      if (!this.andable) {
        return;
      }

      var query = Object.assign({}, this.$route.query);
      query[this.boolName] = this.andOrBool === "and" ? "or" : "and";
      this.$router.replace({
        name: this.$route.name,
        params: this.$route.params,
        query: query,
      });
      this.$store.dispatch("search/search", this.$route);
    },

    defaultBool() {
      return this.criteria[camelCase(this.pillData.name)].andOrDefault || "or";
    },
  },

  watch: {
    valueAsArray(pills) {
      if (pills.length > 1) {
        if (!this.$route.query[this.boolName]) {
          var query = Object.assign({}, this.$route.query);
          query[this.boolName] = this.defaultBool();
          this.$router.replace({
            name: this.$route.name,
            params: this.$route.params,
            query,
          });
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../../assets/stylesheets/variables_and_mixins";

.pill-group {
  border-right: 1px solid $alt-700;
}

/deep/ .pill-container:only-child {
  .badge-pill {
    min-width: 70px;
  }
}
/deep/ .badge-pill {
  border-color: $alt-700;
  .fa {
    margin-left: 1px;
  }
}
/deep/ .double-emphasis {
  font-weight: 500;
  font-style: italic;
}

.multiple-selection-pill {
  text-transform: capitalize;
}
/deep/ .btn-light:focus {
  box-shadow: 0 0 0 0.2rem $alt-500;
}

.orOnly {
  color: $text-dark;
}
.add-icon {
  height: 10px;
  width: 10px;
}
</style>
