<template>
  <div class="form-inline">
    <SelectAll class="col-2" :form="form" />
    <b-input-group class="col-11">
      <b-input-group-text slot="prepend" class="dark"
        >Separate Tags with a Comma</b-input-group-text
      >
      <b-form-input
        placeholder="Tag Names"
        aria-label="Tag Names, please separate names with a comma"
        aria-describedby="tag-name-live-feedback"
        ref="tagNameField"
        :state="$v.tagText.$dirty ? !$v.tagText.$error : null"
        v-model="$v.tagText.$model"
      ></b-form-input>
      <b-form-invalid-feedback
        id="tag-name-live-feedback"
        role="alert"
        aria-live="polite"
      >
        Tags name is a required field and must be at least 3 characters.
      </b-form-invalid-feedback>
    </b-input-group>
    <div class="col d-flex">
      <div class="sr-only" v-if="submitButtonDisabled">
        Form submission disabled until you have items selected and a tag name
        entered.
      </div>
      <b-button
        class="ml-md-auto mr-3"
        type="submit"
        @click="startTag"
        :disabled="noDocsSelected"
        variant="primary"
      >
        <Spinner v-if="working" size="32" />
        <span>Tag Selected Documents ({{ form.checked.length }})</span>
      </b-button>
      <Cancel />
    </div>
  </div>
</template>

<script>
import SelectAll from "./SelectAll";
import _ from "lodash";
import Cancel from "./Cancel";
import FormTagDoc from "./FormTagDoc";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import Spinner from "@shared/Spinner";

export default {
  name: "TagControls",
  components: { Cancel, SelectAll, Spinner },
  mixins: [FormTagDoc, validationMixin],
  data() {
    return {
      tagText: "",
      working: false,
    };
  },
  props: ["form"],
  computed: {
    noDocsSelected() {
      return this.form.checked.length === 0;
    },
    submitButtonDisabled() {
      return this.tagText === "" || this.noDocsSelected;
    },

    tags() {
      return this.tagText.split(",");
    },
  },

  methods: {
    startTag() {
      this.$v.$touch();
      if (this.noDocsSelected) {
        this.$wireNotification({
          group: "main",
          type: "error",
          title: "Error on Tag form",
          text: "You must select at least 1 document",
        });
        var documentCheckInvalid = true;
      }
      if (this.$v.$invalid || documentCheckInvalid) {
        return false;
      }
      var params = {
        bulk_action: "add_to_tag",
        checked: this.form.checked,
        tag: this.tagText,
      };
      this.working = true;
      this.makeRequest(params);
    },
  },

  validations: {
    tagText: {
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
