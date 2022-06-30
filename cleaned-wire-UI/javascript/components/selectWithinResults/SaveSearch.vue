<template>
  <div class="form-inline">
    <b-input-group class="col-10">
      <label for="saved-search-name-input" class="mr-5"
        >Saved Search Name:
      </label>
      <b-form-input
        class=""
        placeholder="Please enter a name for your search"
        id="saved-search-name-input"
        aria-label="Name for your saved search"
        aria-describedby="save-search-name-live-feedback"
        ref="searchNameField"
        :state="$v.saveSearchName.$dirty ? !$v.saveSearchName.$error : null"
        v-model="$v.saveSearchName.$model"
      ></b-form-input>
      <b-form-invalid-feedback id="save-search-name-live-feedback">
        You must enter a name that is at least 3 characters long.
      </b-form-invalid-feedback>
    </b-input-group>
    <b-form-group>
      <b-form-checkbox
        id="overwrite-search"
        v-model="overwrite"
        :state="overwrite"
        class="ml-3"
        ref="overwriteCheckbox"
        v-if="overwriteSearch"
        aria-label="Confirm you want to overwrite your search"
        aria-describedby="overwrite-search-live-feedback"
      >
        Confirm overwrite of existing search?
      </b-form-checkbox>
      <b-form-invalid-feedback id="overwrite-search-live-feedback">
        You must confirm overwrite to save
      </b-form-invalid-feedback>
    </b-form-group>
    <b-button
      variant="primary"
      @click="saveSearch"
      class="ml-auto"
      type="submit"
    >
      <Spinner v-if="working" size="32" />
      <span>Save</span>
    </b-button>
    <Cancel />
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, requiredIf } from "vuelidate/lib/validators";
import axios from "axios";
import { mapMutations, mapState } from "vuex";
import Cancel from "./Cancel";
import Spinner from "@shared/Spinner";

export default {
  name: "SaveSearch",
  components: { Cancel, Spinner },
  mixins: [validationMixin],

  data() {
    return {
      saveSearchName: "",
      overwrite: false,
      working: false,
    };
  },

  computed: {
    ...mapState("savedSearches", ["savedSearches"]),

    existingSearchNames() {
      return this.savedSearches.search.map((x) => x.search_name.toLowerCase());
    },

    overwriteSearch() {
      return this.existingSearchNames.includes(
        this.saveSearchName.toLowerCase()
      );
    },
  },

  methods: {
    renameOverwrite() {
      this.existingSearchNames.forEach(
        function (name) {
          if (this.saveSearchName.toLowerCase() === name.toLowerCase()) {
            this.saveSearchName = name;
          }
        }.bind(this)
      );
    },

    saveSearch() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return false;
      }
      if (this.overwriteSearch && !this.overwrite) {
        this.$refs.overwriteCheckbox.focus();
        return false;
      }
      if (this.overwriteSearch) {
        this.renameOverwrite();
      }
      var searchUrl = "/search?" + this.$route.fullPath.split("?").pop();

      this.working = true;
      axios
        .post(searchUrl, {
          search_name: this.saveSearchName,
        })
        .then(() => {
          this.$store.dispatch("savedSearches/loadSavedSearches");
          this.$wireNotification({
            group: "main",
            title: "Search Saved",
            duration: 5000,
            text: "Search saved as: " + this.saveSearchName,
            type: "success",
          });
          this.$bus.$emit("close-form");
        })
        .catch(() => {
          throw new Error("Error saving search");
        });
    },
  },

  validations: {
    saveSearchName: {
      required,
      minLength: minLength(3),
    },
  },

  mounted() {
    this.$nextTick(() => this.$refs.searchNameField.focus());
  },
};
</script>

<style scoped></style>
