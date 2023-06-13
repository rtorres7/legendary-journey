<template>
  <div>
    <h2 class="info-title d-flex separator mt-6 pb-2">Add Existing Products</h2>
    <p class="pt-3">
      Separate each document ID by a new line to add more than one product at a
      time.
    </p>
    <label>Document Number(s)</label>
    <div class="_temp_39-form">
      <b-form-textarea
        aria-label="Add Document Number(s)"
        v-model="identifiers"
        class="form-control"
        id="doc-identifiers"
        placeholder="Enter at least 10 characters"
        rows="4"
      ></b-form-textarea>

      <b-btn
        class="mt-4 d-flex align-items-center ml-auto"
        variant="primary"
        @click="submitForm"
        :disabled="disableSubmit"
        >Add To Book</b-btn
      >
    </div>
  </div>
</template>

<script>
import Spinner from "@shared/Spinner";
import { mapGetters } from "vuex";

export default {
  name: "AddExistingProducts",
  components: {
    Spinner,
  },
  data() {
    return {
      identifiers: "",
    };
  },
  mounted() {
    this.resetForm();
  },
  computed: {
    ...mapGetters("user", { currentUser: "user" }),
    featureDate() {
      return this.$route.query.date || this.$route.params.date;
    },
    disableSubmit() {
      let val = this.identifiers.trim();
      if (val === "" || val.length < 10) {
        return true;
      }
    },
  },
  methods: {
    resetForm() {
      this.identifiers = "";
    },
    submitForm() {
      this.$store
        .dispatch(`features/featureProduct`, {
          featureDate: this.featureDate,
          docNum: this.identifiers,
          caller: this,
        })
        .then(() => {
          this.identifiers = "";
          this.$bus.$emit("featureUpdated");
        });
    },
  },
  watch: {
    $route() {
      this.resetForm();
    },
  },
};
</script>

<style scoped lang="scss">
.doc-identifiers {
  height: 100px !important;
}
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
.info-title {
  font-family: $font-family-heading;
  font-size: $font-size-6;
  color: $pri-800;
  line-height: 1.5;
}
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
</style>
