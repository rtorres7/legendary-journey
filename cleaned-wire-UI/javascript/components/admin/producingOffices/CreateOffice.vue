<template>
  <div class="mt-4">
    <h2 class="pri-800 separator pb-4 d-flex">{{ producingOfficeTitle }}</h2>
    <b-form @submit="onSubmit">
      <b-form-group
        :label="`Parent ${officeOrDivisionLabel}`"
        label-for="parent-office"
      >
        <b-form-select
          id="parent-office"
          v-model="selectedParent"
          :options="officeOrDivisionList"
          aria-label="Select Parent"
        >
        </b-form-select>
      </b-form-group>
      <b-form-group :label="fieldLabel" label-for="office-name-input">
        <b-input
          id="office-name-input"
          aria-describedby="new-office-live-feedback"
          :state="$v.name.$dirty ? !$v.name.$error : null"
          v-model="$v.name.$model"
          class="mb-3"
        >
        </b-input>
        <b-form-invalid-feedback
          id="new-office-live-feedback"
          aria-live="polite"
          class="mb-3"
        >
          {{ fieldLabel }} must be at least 3 characters.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-btn
        class="mb-3"
        variant="primary"
        type="submit"
        :disabled="$v.$invalid"
        >Create</b-btn
      >
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
import { isEmpty } from "lodash";
import { mapGetters, mapState } from "vuex";
import { validationMixin } from "vuelidate";
import { requiredIf, minLength } from "vuelidate/lib/validators";

export default {
  name: "CreateOffice",

  mixins: [validationMixin],

  data() {
    return {
      name: "",
      selectedParent: "",
    };
  },

  computed: {
    ...mapGetters("producingOffices", ["officeOrDivisionList"]),
    ...mapState("producingOffices", [
      "producingOfficeTitle",
      "officeOrDivisionLabel",
    ]),
    fieldLabel() {
      return `New ${this.officeOrDivisionLabel} name`;
    },
  },

  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      axios
        .post("/admin/producing_offices", {
          name: this.name,
          parent: this.selectedParent,
        })
        .then((response) => {
          if (response.data.success) {
            this.$wireNotification({
              title: this.producingOfficeTitle,
              duration: 5000,
              text: `${this.producingOfficeTitle} has been saved.`,
              type: "success",
            });
            this.$emit("officeUpdated");
          } else {
            this.showError();
          }
        })
        .catch(() => {
          this.showError();
        });
    },
    showError() {
      this.$wireNotification({
        title: this.producingOfficeTitle,
        duration: 5000,
        text: `Error - ${this.producingOfficeTitle} has not been saved.`,
        type: "error",
      });
    },
  },

  validations: {
    name: {
      requiredIf: requiredIf(function () {
        return isEmpty(this.name);
      }),
      minLength: minLength(3),
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
</style>
