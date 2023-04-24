<template>
  <div>
    <div v-if="!folders">
      Retrieving Folders...
      <!-- TODO: Consider adding gentle spinner -->
    </div>
    <div v-else class="form-inline">
      <SelectAll class="col-2" :form="form" />
      <b-input-group v-if="folders.length > 0" class="col-6 mr-6">
        <label for="choose-folder" class="mr-3">Add to Folder</label>
        <b-form-select
          id="choose-folder"
          :options="folderOptions"
          ref="folderField"
          aria-describedby="choose-folder-live-feedback"
          :state="$v.folder.$dirty ? !$v.folder.$error : null"
          v-model="$v.folder.$model"
        ></b-form-select>

        <b-form-invalid-feedback
          id="choose-folder-live-feedback"
          _temp_20="alert"
          aria-live="polite"
        >
          Select a folder. <span class="sr-only"> or create a new folder</span>
        </b-form-invalid-feedback>
      </b-input-group>

      <b-input-group class="col-7">
        <label for="new-folders" class="mr-3"
          >Or Create a New Folder
          <span class="sr-only">with selected documents</span></label
        >
        <b-form-input
          id="new-folders"
          :state="$v.newFolder.$dirty ? !$v.newFolder.$error : null"
          aria-describedby="new-folder-live-feedback"
          v-model="$v.newFolder.$model"
        ></b-form-input>

        <b-form-invalid-feedback
          id="new-folder-live-feedback"
          aria-live="polite"
        >
          Enter a new folder, at least 3 characters.
        </b-form-invalid-feedback>
      </b-input-group>

      <div class="col d-flex">
        <b-button
          class="ml-md-auto mr-3"
          type="submit"
          @click="submitFolder"
          variant="primary"
        >
          <Spinner v-if="working" size="32" />
          <span>Add {{ form.checked.length }} Item(s) to Folder</span>
        </b-button>
        <Cancel />
      </div>
    </div>
  </div>
</template>

<script>
import SelectAll from "./SelectAll";
import Cancel from "./Cancel";
import FormTagDoc from "./FormTagDoc";
import Spinner from "@shared/Spinner";
import axios from "axios";
import { validationMixin } from "vuelidate";
import { requiredIf, minLength } from "vuelidate/lib/validators";

export default {
  name: "AddToFolder",
  components: { Cancel, SelectAll, Spinner },
  props: ["form"],
  mixins: [FormTagDoc, validationMixin],
  data() {
    return {
      folders: null,
      newFolder: "",
      folder: "",
      working: false,
    };
  },

  computed: {
    folderOptions() {
      var opts = [];
      this.folders.forEach((folder) => {
        opts.push({
          value: folder.name,
          text: folder.name,
        });
      });
      return opts;
    },
  },

  mounted() {
    axios.get("/my_wire/folders.json").then((response) => {
      this.folders = response.data.folders;
    });
  },

  methods: {
    submitFolder() {
      this.$v.$touch();
      if (this.form.checked.length === 0) {
        this.$wireNotification({
          group: "main",
          type: "error",
          title: "Error on folder form",
          text: "You must select at least 1 document",
        });
        var documentCheckInvalid = true;
      }
      var params = {
        bulk_action: "add_to_folder",
        checked: this.form.checked,
        folder: this.folder === "" ? this.newFolder : this.folder,
      };
      if (this.$v.$invalid || documentCheckInvalid) {
        return false;
      }
      this.working = true;
      this.makeRequest(params);
    },
  },

  validations: {
    folder: {
      requiredIf: requiredIf(function () {
        return this.folder === "" && this.newFolder === "";
      }),
    },

    newFolder: {
      requiredIf: requiredIf(function () {
        return this.folder === "" && this.newFolder === "";
      }),
      minLength: minLength(3),
    },
  },
};
</script>

<style scoped></style>
