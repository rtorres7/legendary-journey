<template>
  <div>
    <div class="text-center" v-if="loading">
      <spinner />
    </div>
    <Feed
      v-else-if="feed"
      :feed="feed"
      :preview="true"
      ref="preview"
      :deleteDisabled="true"
    />

    <div class="d-flex justify-content-around pt-5" v-if="feed && feed.items">
      <b-button
        variant="link"
        size="lg"
        type="reset"
        class="rounded-0"
        @click="cancel"
      >
        <img
          :src="require('@assets/cancel-button-icon.svg')"
          _temp_20="presentation"
          class="icon mr-1 mb-2"
        />
        Cancel
      </b-button>
      <b-button
        variant="primary"
        size="lg"
        :disabled="form.submitDisabled"
        type="submit"
        class="rounded-0"
      >
        <img
          :src="require('@assets/plus-button-icon.svg')"
          _temp_20="presentation"
          class="icon mr-1 mb-2"
        />
        Add
      </b-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Feed from "../Feed";
import { debounce } from "lodash";
import Spinner from "../../../shared/Spinner";

export default {
  name: "Preview",
  components: { Spinner, Feed },
  props: ["form"],

  data() {
    return {
      loading: false,
      feed: null,
      buttonDisable: false,
    };
  },

  methods: {
    preview: debounce(function () {
      axios
        .post("/my_wire/portlets/preview", {
          portlet: this.form,
        })
        .then((response) => {
          const previewPortlet = response.data.portlets[0];
          if (previewPortlet) {
            this.feed = {
              items: previewPortlet.items,
              articles: previewPortlet.articles,
              portlet: previewPortlet.portlet,
            };
            this.$nextTick(
              function () {
                this.$refs.preview.$refs.item[0].$el.children[0].focus();
              }.bind(this)
            );
          }
          this.loading = false;
          this.buttonDisable = false;
        });
    }, 500),
    cancel() {
      this.$bus.$emit("reset_portlet_form");
    },
  },

  watch: {
    form: {
      deep: true,
      handler() {
        this.feed = null;
        if (
          this.form.search_id ||
          this.form._temp_1 ||
          this.form.recommended_feed_id
        ) {
          this.loading = true;
          this.preview();
        }
      },
    },
  },

  mounted() {
    this.$bus.$on(
      "reset_portlet_form",
      function () {
        this.feed = null;
      }.bind(this)
    );
  },
};
</script>

<style scoped>
img.icon {
  height: 24px;
  width: 24px;
}
</style>
