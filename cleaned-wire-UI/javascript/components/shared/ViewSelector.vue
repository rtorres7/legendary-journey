<template>
  <b-form-group class="cozy-compact-selector">
    <b-form-radio-group
      v-model="compact"
      buttons
      size="sm"
      :options="compactCozyOpts"
      button-variant="outline-dark"
    >
    </b-form-radio-group>
    <b-form-radio-group
      v-if="featuresAvailable.searchVisualsEnabled"
      v-model="compact"
      buttons
      size="sm"
      :options="visuals"
      button-variant="outline-dark"
    >
    </b-form-radio-group>
  </b-form-group>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import navigationErrorHandlerMixin from "@shared/mixins/navigationErrorHandlerMixin";

export default {
  name: "ViewSelector",
  mixins: [navigationErrorHandlerMixin],

  data() {
    return {
      compactCozyOpts: [
        { text: "Grid", value: "grid" },
        { text: "List", value: "list" },
      ],
      visuals: [{ text: "Visuals Only", value: "visuals" }],
    };
  },

  computed: {
    ...mapState("metadata/criteria", ["mediaTags"]),
    ...mapState("metadata", ["featuresAvailable"]),
    compact: {
      get() {
        return this.$route.query?.view ? this.$route.query?.view : "list";
      },
      set(value) {
        let query = Object.assign({}, this.$route.query);
        query.view = value;
        if (value !== "list") {
          this.$bus.$emit("close-form");
        }
        if (value === "visuals") {
          this.clearSearch();
          query["media_tags[]"] = [];
          this.mediaTags.values.forEach((tag) => {
            query["media_tags[]"].push(tag.code);
          });
        }
        this.$router.push({ query }).catch((failure) => {
          this.handleNavigationErrors(failure);
        });
      },
    },
  },

  methods: {
    ...mapMutations("search", ["clearSearch"]),
    bindToEvent(toolEvent) {
      this.$bus.$on(toolEvent, () => {
        if (this.$route.query.view !== "list") {
          this.compact = "list";
        }
      });
    },
  },

  mounted() {
    ["set-export", "set-folder", "set-tag"].forEach((tool) => {
      this.bindToEvent(tool);
    });
  },
};
</script>

<style scoped lang="scss">
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
</style>
