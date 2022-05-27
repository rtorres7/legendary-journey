<template>
  <b-form @submit.prevent @submit="submit">
    <b-row class="p-5">
      <h2 class="heading-stylized">Add A Feed</h2>
    </b-row>
    <b-row class="custom-gutters">
      <b-col md="8" class="px-5 custom-gutter-col">
        <b-card class="p-5" title="Step 1: Select Feed Type">
          <b-form-group>
            <b-form-radio
              v-model="form.portlet_type"
              name="recommended-feeds"
              @change="resetSubForm"
              value="recommended"
              class="mb-3"
            >
              <img
                :src="require('@assets/check-mark.svg')"
                role="presentation"
                class="icon mr-1 mb-2"
              />
              WIRe's Recommended Feeds
            </b-form-radio>
            <b-form-radio
              v-model="form.portlet_type"
              name="saved-search"
              @change="resetSubForm"
              value="search"
              class="mb-3"
            >
              <img
                :src="require('@assets/save.svg')"
                role="presentation"
                class="icon mr-1 mb-2"
              />
              Saved Searches
            </b-form-radio>
            <b-form-radio
              v-model="form.portlet_type"
              name="add-a-feed"
              @change="resetSubForm"
              value="rss"
              class="mb-3"
            >
              <img
                :src="require('@assets/rss.svg')"
                role="presentation"
                class="icon mr-1 mb-2"
              />
              Add an External Feed
            </b-form-radio>
          </b-form-group>
        </b-card>
      </b-col>
      <b-col md="8" class="px-5 custom-gutter-col">
        <b-card class="p-5" title="Step 2: Set Up Your Feed">
          <component :is="portletSelections" :form="form" />
        </b-card>
      </b-col>
      <b-col md="8" class="">
        <div class="px-5 custom-gutter-col">
          <b-card class="p-5 mb-5" title="Step 3: Preview Your Feed" />
        </div>

        <Preview class="pb-5" :form="form" />
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import SavedSearchesPortlet from "./SavedSearchesPortlet";
import axios from "axios";
import FeedPortlet from "./FeedPortlet";
import Recommended from "./Recommended";
import Preview from "./Preview";

export default {
  name: "Personalize",
  components: { Preview, Recommended },
  data() {
    return {
      form: {
        portlet_type: "",
        submitDisabled: false,
        url: "",
        recommended_feed_id: "",
        title: "",
        search_id: "",
      },
    };
  },

  methods: {
    submit() {
      this.form.submitDisabled = true;
      axios
        .post("/my_wire/portlets", {
          portlet: this.form,
        })
        .then(() => {
          this.$store.dispatch("portlets/loadPortlets");
        })
        .catch((e) => {
          this.$wireNotification({
            group: "main",
            type: "error",
            title: "Error creating portlet",
            text:
              "Something went wrong creating your feed. Please try again later",
          });
        });
      this.$bus.$emit("reset_portlet_form");
    },

    reset() {
      this.form = {
        portlet_type: "",
        submitDisabled: false,
        url: "",
        recommended_feed_id: "",
        title: "",
        search_id: "",
      };
    },

    resetSubForm() {
      this.form.recommended_feed_id = "";
      this.form.title = "";
      this.form.url = "";
      this.form.search_id = "";
    },
  },

  computed: {
    portletSelections() {
      if (this.form.portlet_type === "search") {
        return SavedSearchesPortlet;
      } else if (this.form.portlet_type === "rss") {
        return FeedPortlet;
      } else if (this.form.portlet_type === "recommended") {
        return Recommended;
      }
    },
  },

  mounted() {
    this.$bus.$on("reset_portlet_form", this.reset);
  },
};
</script>

<style scoped lang="scss">
.card-title {
  font-size: $font-size-4;
  font-weight: 500;
}

.card {
  border: 1px solid $alt-500;
  border-radius: 0;
}

img.icon {
  height: 16px;
  width: 16px;
}

/deep/ .form-group .col-form-label {
  font-size: $font-size-2;
}

/deep/ div.custom-radio {
  color: $link-color;
  font-size: $font-size-3;
  padding-bottom: $spacer-1;
  margin-bottom: $spacer-1;
}
</style>
