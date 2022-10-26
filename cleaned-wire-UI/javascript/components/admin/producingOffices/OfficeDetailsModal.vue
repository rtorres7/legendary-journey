<template>
  <b-modal
    id="edit-producing-office-details"
    size="lg"
    :title="`Edit ${producingOfficeLabel}`"
    title-class="modal-header-title"
    ok-title="Save"
    @show="initForm"
    @ok="onSubmit"
  >
    <b-form @submit="onSubmit" class="pt-6" v-if="producingOffice">
      <b-form-group
        label="Office Name"
        label-for="office-name"
        invalid-feedback="Office Name must be at least 3 characters."
      >
        <b-input
          id="office-name"
          aria-describedby="producing-office-name-help"
          :state="
            $v.producingOffice.name.$dirty
              ? !$v.producingOffice.name.$error
              : null
          "
          v-model="$v.producingOffice.name.$model"
          class="mb-3"
          autofocus
        >
        </b-input>
        <small id="producing-office-name-help" class="text-muted"
          >As shown to WIRe users</small
        >
      </b-form-group>

      <b-form-group
        label="Office Acronym"
        label-for="office-acronym"
        invalid-feedback="Office Acronym cannot be blank."
      >
        <b-input
          id="office-acronym"
          aria-describedby="producing-office-acronym-help"
          :state="
            $v.producingOffice.acronym.$dirty
              ? !$v.producingOffice.acronym.$error
              : null
          "
          v-model="$v.producingOffice.acronym.$model"
          class="mb-3"
        >
        </b-input>
        <small id="producing-office-acronym-help" class="text-muted"
          >Must match the XML POC values</small
        >
      </b-form-group>

      <b-form-group label="Official Office Title" label-for="office-title">
        <b-input
          id="office-title"
          aria-describedby="producing-office-title-help"
          v-model="producingOffice.title"
          class="mb-3"
        >
        </b-input>
        <small id="producing-office-title-help" class="text-muted"
          >Must match the XML attribution from EDT</small
        >
      </b-form-group>
      <b-form-group :label="parentLabel" label-for="office-parent">
        <b-form-select
          id="office-parent"
          v-model="producingOffice.parent_id"
          :options="officeOrDivisionParentList(officeOrDivision)"
          aria-label="Select Parent"
        >
        </b-form-select>
      </b-form-group>
      <b-form-group label="POC Information" label-for="office-poc-info">
        <b-textarea
          id="office-poc-info"
          v-model="producingOffice.poc_info"
          class="mb-3"
        >
        </b-textarea>
      </b-form-group>

      <div class="row">
        <div class="col-md-6">
          <b-form-checkbox
            aria-describedby="producing-office-legacy-help"
            v-model="producingOffice.legacy"
            >Legacy Organization?</b-form-checkbox
          >
        </div>
        <div class="col-md-16">
          <small id="producing-office-legacy-help" class="text-muted"
            >Appends "(Legacy)" to the displayed name</small
          >
        </div>
      </div>

      <hr />

      <div class="row pb-5">
        <div class="col-md-6">
          <b-form-checkbox
            aria-describedby="producing-office-congress-help"
            v-model="producingOffice.congress"
            disabled
            >Visible to Congress?</b-form-checkbox
          >
        </div>
        <div class="col-md-16">
          <small id="producing-office-congress-help" class="text-muted"
            >Changes this office's visibility in search results. If this needs
            to change, please write to the development team</small
          >
        </div>
      </div>

      <b-form-group label="User Label" label-for="office-user-label">
        <b-input
          id="office-user-label"
          aria-describedby="producing-office-user-label-help"
          v-model="producingOffice.user_label"
          disabled
          class="mb-3"
        >
        </b-input>
        <small id="producing-office-user-label-help" class="text-muted"
          >Debugging data - used to build search results</small
        >
      </b-form-group>

      <b-form-group label="Ingest Label" label-for="office-ingest-label">
        <b-input
          id="office-ingest-label"
          aria-describedby="producing-office-ingest-label-help"
          v-model="producingOffice.label"
          disabled
          class="mb-3"
        >
        </b-input>
        <small id="producing-office-ingest-label-help" class="text-muted"
          >Debugging data - used to build search results</small
        >
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import axios from "axios";
import { mapGetters, mapState } from "vuex";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import { startCase } from "lodash";

export default {
  name: "OfficeDetailsModal",
  mixins: [validationMixin],
  data() {
    return {
      producingOffice: {
        parent_id: "",
        name: "",
        acronym: "",
        title: "",
        poc_info: "",
        legacy: false,
        congress: false,
      },
    };
  },
  computed: {
    ...mapGetters("producingOffices", [
      "officeOrDivision",
      "officeOrDivisionParentList",
    ]),
    ...mapState("producingOffices", [
      "officeOrDivisionLabel",
      "producingOfficeLabel",
      "selectedNode",
    ]),
    parentLabel() {
      return `Parent ${startCase(this.officeOrDivisionLabel)}`;
    },
  },
  methods: {
    initForm() {
      this.producingOffice = Object.assign({}, this.officeOrDivision);
      this.producingOffice.parent_id = this.officeOrDivision.ancestry
        ? this.officeOrDivision.ancestry.split("/").pop()
        : this.officeOrDivision.ancestry;
    },
    onSubmit(evt) {
      // omit ingest label and user_label values, since they will be dynamically
      // updated based on parent org, acronym and name value
      const { label, user_label, ...formData } = this.producingOffice;
      axios
        .patch(`/admin/producing_offices/${this.producingOffice.id}`, {
          producing_office: formData,
        })
        .then((response) => {
          if (response.data.success) {
            this.$wireNotification({
              title: this.producingOfficeLabel,
              duration: 5000,
              text: `${this.producingOffice.name} was updated.`,
              type: "success",
            });
            let updatedNode = Object.assign({}, this.selectedNode);
            updatedNode.value = response.data.office;
            this.$store.commit("producingOffices/setSelectedNode", updatedNode);
            this.$emit("officeUpdated");
          } else {
            this.showError();
          }
        })
        .catch((e) => {
          this.showError();
        });
    },
    showError() {
      this.$wireNotification({
        title: this.producingOfficeTitle,
        duration: 5000,
        text: `Error - There was a problem updating ${this.officeOrDivision.name}.`,
        type: "error",
      });
    },
  },
  validations: {
    producingOffice: {
      name: {
        required,
        minLength: minLength(3),
      },
      acronym: {
        required,
      },
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
