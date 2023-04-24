<template>
  <div>
    <b-form-group label="Select one of the recommended feeds to preview">
      <div class="text-center" v-if="loading">
        <spinner />
      </div>
      <b-form-radio
        v-model="form.recommended_feed_id"
        v-else
        v-for="(portlet, ind) in recommended.portlets"
        :key="ind"
        ref="radio"
        :name="portlet.title"
        :value="portlet.id"
      >
        {{ portlet.title }}
      </b-form-radio>
    </b-form-group>
  </div>
</template>

<script>
import axios from "axios";

import Spinner from "../../../shared/Spinner";
export default {
  name: "Recommended",
  components: { Spinner },
  props: ["form"],
  data() {
    return {
      loading: true,
      recommended: null,
    };
  },

  mounted() {
    axios.get("/my_wire/portlets/recommended").then((response) => {
      this.recommended = response.data;
      this.loading = false;
      this.$nextTick(
        function () {
          // In order to set the focus to the top of the recommended row:
          // Grab the radio rows, take the first one, and then set focus to the first child (radio button) within that
          this.$refs.radio[0].$el.children[0].focus();
        }.bind(this)
      );
    });
  },

  watch: {
    form: {
      deep: true,
      handler() {
        this.recommended.portlets.forEach(
          function (portlet) {
            if (this.form.recommended_feed_id) {
              if (portlet.id === this.form.recommended_feed_id) {
                this.form._temp_1 = portlet._temp_1;
                this.form.title = portlet.title;
              }
            }
          }.bind(this)
        );
      },
    },
  },
};
</script>

<style scoped></style>
