<template>
  <div>
    <b-modal
      v-model="showModal"
      :title="`${editFlag ? 'Edit' : 'Create'} Product Type`"
      title-class="modal-header-title"
      :ok-title="`${editFlag ? 'Save' : 'Create'}`"
      @ok="okAction"
      @ok.prevent
      @show="resetModal"
      :ok-disabled="$v.$invalid || saveDisabled"
    >
      <b-form @submit.prevent="">
        <b-form-group :invalid-feedback="feedback('name')">
          <label class="pt-4">Product Name</label>
          <b-input
            aria-label="Product Name"
            autofocus
            v-model="product.name"
            :state="isValid('name')"
            trim
          />
        </b-form-group>

        <b-form-group :invalid-feedback="feedback('short_name')">
          <label class="pt-4">Short Name</label>
          <b-input
            aria-label="Short Name"
            v-model="product.short_name"
            :state="isValid('short_name')"
            trim
          />
        </b-form-group>

        <b-form-group :invalid-feedback="feedback('ingest_name')">
          <label class="pt-4">Ingest Name</label>
          <b-input
            aria-label="Ingest Name"
            v-model="product.ingest_name"
            :state="isValid('ingest_name')"
            trim
          />
        </b-form-group>

        <b-form-group :invalid-feedback="feedback('abbreviation')">
          <label class="pt-4">Abbreviation</label>
          <b-input
            aria-label="Abbreviation"
            v-model="product.abbreviation"
            :state="isValid('abbreviation')"
            trim
            :maxLength="$v.product.abbreviation.$params.maxLength.max + 1"
          />
        </b-form-group>

        <b-form-group :invalid-feedback="feedback('reporting_type_id')">
          <label class="pt-4">Reporting Type</label>
          <b-form-select
            :options="reportingTypes"
            aria-label="Reporting Type"
            v-model="product.reporting_type_id"
            :state="isValid('reporting_type_id')"
          />
        </b-form-group>

        <b-form-group :invalid-feedback="feedback('description')">
          <label class="pt-4">Description</label>
          <b-form-textarea
            rows="3"
            aria-label="Description"
            v-model="product.description"
            :state="isValid('description')"
            trim
            :maxLength="$v.product.description.$params.maxLength.max + 1"
          />
        </b-form-group>

        <b-form-checkbox class="pt-4" v-model="product.congress"
          >Viewable by Congress</b-form-checkbox
        >
      </b-form>
      <div v-if="isSaving" class="spinner">
        Saving Product Type....
        <Spinner size="32" />
      </div>
    </b-modal>
  </div>
</template>

<script>
import Spinner from "@shared/Spinner";
import axios from "axios";
import { capitalize } from "lodash";
import { maxLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  name: "ProductTypeModal",
  mixins: [validationMixin],
  components: {
    Spinner,
  },
  props: {
    editFlag: {
      default: false,
    },
    reportingTypes: {
      required: true,
    },
    productType: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      showModal: false,
      product: Object.assign({}, this.productType),
      serverErrors: {},
      saveDisabled: false,
      isSaving: false,
    };
  },
  validations: {
    product: {
      name: { required },
      short_name: { required },
      ingest_name: { required },
      abbreviation: { required, maxLength: maxLength(10) },
      reporting_type_id: { required },
      description: { required, maxLength: maxLength(2000) },
    },
  },
  mounted() {},
  computed: {},
  methods: {
    okAction(evt) {
      this.saveDisabled = true;
      this.isSaving = true;
      this.$announcer.set("saving product type");
      if (this.editFlag) {
        axios
          .patch("/admin/product_types/" + this.product.id, this.product)
          .then((response) => {
            this.showSuccessMsg();
          })
          .catch((err) => {
            this.showErrorMsg(err);
          });
      } else {
        axios
          .post("/admin/product_types", this.product)
          .then((response) => {
            this.showSuccessMsg();
          })
          .catch((err) => {
            this.showErrorMsg(err);
          });
      }
      this.saveDisabled = false;
      this.isSaving = false;
    },
    showSuccessMsg() {
      this.$wireNotification({
        title: `Product Type ${this.editFlag ? "Updated" : "Created"}`,
        duration: 5000,
        text: `Product Type ${this.product.name} has been ${
          this.editFlag ? "updated" : "created"
        }`,
        type: "success",
      });
      this.$emit(`productType${this.editFlag ? "Updated" : "Created"}`);
      this.showModal = false;
    },
    showErrorMsg(err) {
      var hasFieldError = false;
      this.serverErrors = err.response.data.errors || {};
      Object.keys(this.serverErrors).forEach((key) => {
        hasFieldError = hasFieldError || !!this.product[key];
      });

      if (!hasFieldError) {
        // We have an unknown error, show the notification
        this.$wireNotification({
          title: `Product Type ${this.editFlag ? "Update" : "Create"} failed`,
          duration: 5000,
          text: `Product Type ${this.product.name} failed ${
            this.editFlag ? "update" : "create"
          }`,
          type: "error",
        });
      }
    },
    isValid(fieldName) {
      return (
        !this.serverErrors[fieldName] && !this.$v.product[fieldName].$invalid
      );
    },
    feedback(fieldName) {
      var errors = [];

      var field = this.$v.product[fieldName];
      if (!field.required && field.$invalid) {
        errors.push("Field is required");
      } else if (!field.maxLength && field.$invalid) {
        errors.push(
          `Field cannot exceed ${field.$params.maxLength.max} characters.`
        );
      }

      this.serverErrors[fieldName]?.map((err) => {
        errors.push(capitalize(err));
      });

      return errors[0];
    },
    resetModal() {
      this.product = Object.assign({}, this.productType);
      this.serverErrors = {};
      this.saveDisabled = false;
    },
  },
};
</script>

<style scoped lang="scss">
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
.spinner {
  text-align: center;
}
</style>
