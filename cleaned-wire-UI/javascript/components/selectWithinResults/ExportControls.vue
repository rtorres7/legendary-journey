<template>
  <div class="form-inline">
    <SelectAll class="col-2" :form="form" />
    <b-input-group class="col-8 mr-6">
      <b-input-group-text slot="prepend" class="dark">{{
        portionMark
      }}</b-input-group-text>
      <b-form-input
        placeholder="Export Name"
        id="export-name-input"
        aria-label="Export name, max classification is U//FOUO"
        aria-describedby="export-name-live-feedback"
        ref="exportNameField"
        auto-focus
        :state="$v.plainText.$dirty ? !$v.plainText.$error : null"
        v-model="$v.plainText.$model"
      >
      </b-form-input>
      <b-form-invalid-feedback
        id="export-name-live-feedback"
        role="alert"
        aria-live="polite"
      >
        Export name is a required field and must be at least 3 characters.
      </b-form-invalid-feedback>
    </b-input-group>
    <b-form-select
      v-model="format"
      aria-label="Export Type"
      class="w-100 col-4 mr-6"
      :options="featuresAvailable.searchExportFormatOptions"
    >
    </b-form-select>
    <b-form-select
      v-model="allOrSelected"
      aria-label="Export Amount"
      class="w-100 col-4 mr-6"
      :options="allSelectOptions"
    ></b-form-select>
    <div class="col d-flex">
      <div class="sr-only" v-if="submitButtonDisabled">
        Form submission disabled until you have items selected and chosen export
        options. If selecting all, you must have less than 10,000 total results.
      </div>
      <b-button
        class="ml-md-auto"
        variant="primary"
        @click="startExport"
        type="submit"
        :disabled="submitButtonDisabled"
      >
        <Spinner v-if="working" size="32" />
        <span>Export</span>
      </b-button>
      <Cancel />
    </div>
    <div
      v-if="submitButtonDisabled && allOrSelected === 'full'"
      class="text-right w-100"
    >
      You must have less than 10,000 results to export.
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SelectAll from "./SelectAll";
import Cancel from "./Cancel";
import FormTagDoc from "./FormTagDoc";
import Spinner from "@shared/Spinner";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "Export",
  components: { Cancel, SelectAll, Spinner },
  props: ["form"],
  mixins: [FormTagDoc, validationMixin],
  data() {
    return {
      allOrSelected: "Selected",
      format: null,
      plainText: "",
      portionMark: "(U//FOUO)",
      working: false,
    };
  },
  mounted() {
    this.format = this.featuresAvailable.defaultSearchExportFormat;
  },
  computed: {
    ...mapState("search", ["results", "totalCount"]),
    ...mapState("metadata", ["featuresAvailable"]),

    allSelectOptions() {
      return [
        {
          text: "All",
          value: "full",
        },
        {
          value: "Selected",
          text: "Selected (" + this.form.checked.length + ")",
        },
      ];
    },
    submitButtonDisabled() {
      if (this.allOrSelected === "Selected") {
        return this.form.checked.length === 0;
      } else {
        return this.totalCount > 10000;
      }
    },
    text: {
      get() {
        return this.portionMark + " " + this.plainText;
      },
    },
  },

  methods: {
    startExport() {
      this.$v.$touch();
      if (this.allOrSelected === "Selected" && this.form.checked.length === 0) {
        this.$wireNotification({
          group: "main",
          type: "error",
          title: "Error on Export Form",
          text: "You must select at least 1 document",
        });
        var documentCheckInvalid = true;
      }
      if (this.$v.$invalid || documentCheckInvalid) {
        return false;
      }
      var params = {
        export_type: this.allOrSelected,
        export_format: this.format.toLowerCase().replace(" ", "_"),
        export: this.portionMark + " " + this.plainText,
        bulk_action: "export_as_zip",
      };
      if (this.allOrSelected === "Selected") {
        params.checked = this.form.checked;
      } else {
        params.query = `action=index&controller=search&${
          this.$route.fullPath.split("?")[1]
        }`;
        params.query_total = this.totalCount;
      }
      this.working = true;
      this.makeRequest(params);
    },
  },

  validations: {
    plainText: {
      required,
      minLength: minLength(3),
    },
  },
};
</script>

<style scoped lang="scss">
.dark {
  color: $text-dark;
}
</style>
