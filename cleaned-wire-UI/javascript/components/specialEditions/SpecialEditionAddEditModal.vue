<template>
  <div>
    <b-modal
      size="xl"
      v-model="showModal"
      :title="`${editFlag ? 'Edit' : 'Create'} Special Edition`"
      title-class="modal-header-title"
      :ok-title="`${editFlag ? 'Save' : 'Create'}`"
      @ok="okAction"
      @ok.prevent
      @show="reset"
      :ok-disabled="!$v.$anyDirty || $v.$invalid"
      no-close-on-backdrop
    >
      <b-form @submit.prevent="">
        <b-row>
          <b-col class="mr-6">
            <b-form-group :invalid-feedback="feedback('name')">
              <label class="pt-4">Name</label>
              <b-input
                aria-label="Name"
                autofocus
                v-model="$v.edition.name.$model"
                :state="isValid('name')"
                trim
              />
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group :invalid-feedback="feedback('name_classification')">
              <label class="pt-4">Name Classification</label>
              <Classify
                aria-label="Name Classification"
                label="Classification"
                :item-to-classify.sync="nameClassification"
                :dn="currentUser.dn"
                :classification-favorites="[]"
                @new-classification-selected="updateNameClassification"
                portionMark
                :state="isValid('name_classification')"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="mr-6">
            <b-form-group :invalid-feedback="feedback('search_params')">
              <label class="pt-4">Search params</label>
              <b-input
                aria-label="Search params"
                v-model="$v.edition.search_params.$model"
                :state="isValid('search_params')"
                trim
              />
              <small class="text-muted">
                Run a search, copy the _temp_506, and paste it here.
              </small>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group :invalid-feedback="feedback('icon')" class="pt-6">
              <img
                v-if="!iconLoading && edition.icon"
                :src="edition.icon"
                alt="thumbnail"
                height="70px"
                width="70px"
              />
              <b-form-file
                class="w-50 d-inline"
                plain
                aria-label="File icon"
                v-model="iconFile"
                :state="isValid('icon')"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col class="mr-6">
            <b-form-group :invalid-feedback="feedback('key_leaders')">
              <label class="pt-4">Key People</label>
              <b-textarea
                aria-label="Key People"
                v-model="$v.edition.key_leaders.$model"
                :state="isValid('key_leaders')"
                trim
                rows="4"
              />
              <small class="text-muted">
                One Leader document per line, ex: LP 16-123456.
              </small>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group :invalid-feedback="feedback('key_readings')">
              <label class="pt-4">Selected Readings</label>
              <b-textarea
                aria-label="Selected Readings"
                v-model="$v.edition.key_readings.$model"
                :state="isValid('key_readings')"
                trim
                rows="4"
              />
              <small class="text-muted">
                One document number per line, ex: WIRe110416-02.
              </small>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col class="mr-6">
            <b-form-group :invalid-feedback="feedback('state')">
              <label class="pt-4">State</label>
              <b-form-select
                :options="stateTypes"
                aria-label="State"
                v-model="$v.edition.state.$model"
                :state="isValid('state')"
                @change="$v.edition.position.$touch()"
              />
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group>
              <label class="pt-4">Order</label>
              <b-form-select
                :options="order"
                aria-label="order"
                v-model="$v.edition.position.$model"
              />
              <small class="text-muted">
                First five special editions appear on the home page.
              </small>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import Classify from "@shared/Classify";
import axios from "axios";
import { capitalize } from "lodash";
import { required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapGetters } from "vuex";

function hasLessThanSevenRows(val) {
  return val?.split("\n").length <= 6;
}

export default {
  name: "SpecialEditionAddEditModal",
  mixins: [validationMixin],
  components: { Classify },
  props: {
    editFlag: {
      default: false,
    },
    specialEdition: {
      type: Object,
      required: false,
      default() {
        return {
          icon: null,
          name: null,
          name_classification: null,
          search_params: null,
          state: null,
          position: 1,
          key_leaders: "",
          key_readings: "",
        };
      },
    },
  },
  data() {
    return {
      showModal: false,
      edition: Object.assign({}, this.specialEdition),
      serverErrors: {},
      stateTypes: [
        { value: "posted", text: "Posted" },
        { value: "archived", text: "Archived" },
        { value: "draft", text: "Draft" },
      ],
      order: Array.from(Array(100).keys()).map((i) => i + 1),
      iconFile: null,
      iconImage: null,
      iconLoading: false,
    };
  },
  watch: {
    iconFile(file) {
      this.$v.edition.icon.$model = null;
      this.iconImage = null;
      if (file) {
        this.iconLoading = true;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.$v.edition.icon.$model = reader.result; //Base64
          this.updateIconImage();
        };
      }
    },
  },
  validations: {
    edition: {
      icon: {
        required,
        isImageValidSize() {
          return this.iconImage?.width <= 70 && this.iconImage?.height <= 70;
        },
      },
      key_leaders: { hasLessThanSevenRows },
      key_readings: { hasLessThanSevenRows },
      name: { required },
      name_classification: {
        required,
        isBelowTopSecret(classification) {
          return !classification.startsWith("TS");
        },
      },
      position: {},
      search_params: { required },
      state: { required },
    },
  },
  mounted() {},
  computed: {
    ...mapGetters("user", { currentUser: "user" }),
    nameClassification() {
      return {
        id: this.edition.position,
        classification_string: this.edition.name_classification,
        classification_xml: this.edition.name_classification_xml,
      };
    },
  },
  methods: {
    okAction(evt) {
      if (this.editFlag) {
        axios
          .patch("/special_editions/" + this.edition.id, this.buildFormData())
          .then((response) => {
            this.showSuccessMsg(response);
          })
          .catch((err) => {
            this.showErrorMsg(err);
          });
      } else {
        axios
          .post("/special_editions", this.buildFormData())
          .then((response) => {
            this.showSuccessMsg(response);
          })
          .catch((err) => {
            this.showErrorMsg(err);
          });
      }
    },
    buildFormData() {
      const formData = new FormData();

      Object.keys(this.$v.edition).forEach((key) => {
        const isDirty = this.$v.edition[key].$dirty;
        if (key === "icon" && isDirty) {
          formData.append(key, this.iconFile);
        } else if (key === "name_classification" && isDirty) {
          formData.append(
            "name_classification",
            this.edition.name_classification
          );
          formData.append(
            "name_classification_xml",
            this.edition.name_classification_xml
          );
        } else if (isDirty) {
          formData.append(key, this.edition[key]);
        }
      });

      return formData;
    },
    showSuccessMsg(response) {
      this.$wireNotification({
        title: `Special Edition ${this.editFlag ? "Updated" : "Created"}`,
        duration: 5000,
        text: `Special Edition ${this.edition.name} has been ${
          this.editFlag ? "updated" : "created"
        }`,
        type: "success",
      });

      this.$store.dispatch("concepts/loadConceptsLinks", {
        caller: this,
      });

      if (this.editFlag) {
        this.$emit(`specialEditionUpdated`);
      } else {
        this.$emit(`specialEditionCreated`, response.data.id);
      }
      this.showModal = false;
    },
    showErrorMsg(err) {
      var hasFieldError = false;
      this.serverErrors = err.response.data.errors || {};
      Object.keys(this.serverErrors).forEach((key) => {
        hasFieldError = hasFieldError || !!this.edition[key];
      });
      if (!hasFieldError) {
        // We have an unknown error, show the notification
        this.$wireNotification({
          title: `Special Edition ${
            this.editFlag ? "Update" : "Create"
          } failed`,
          duration: 5000,
          text: `Special Edition ${this.edition.name} failed ${
            this.editFlag ? "update" : "create"
          }`,
          type: "error",
        });
      }
    },
    isValid(fieldName) {
      var field = this.$v.edition[fieldName] || this.$v[fieldName];
      return !this.serverErrors[fieldName] && !field.$invalid;
    },
    feedback(fieldName) {
      var field = this.$v.edition[fieldName] || this.$v[fieldName];
      if (field.required == false) {
        return "Field is required";
      } else if (field.isImageValidSize === false) {
        if (this.iconImage) {
          return `Maximum size: 70x70 pixels. Current size: ${this.iconImage.width}x${this.iconImage.height} pixels.`;
        } else if (this.iconLoading) {
          return "Image processing...";
        } else {
          return "Invalid image detected";
        }
      } else if (field.hasLessThanSevenRows === false) {
        return "Maximum allowed is 6";
      } else if (field.isBelowTopSecret === false) {
        return "Maximum classification allowed is S//_temp_353";
      } else {
        if (this.serverErrors[fieldName]) {
          var error = this.serverErrors[fieldName][0];

          var errors = [];
          if (Array.isArray(error)) {
            error.map((txt) => {
              errors.push(capitalize(txt));
            });
          } else {
            errors.push(capitalize(error));
          }

          return errors.join(", ");
        }
      }
    },
    reset() {
      this.edition = Object.assign({}, this.specialEdition);
      this.updateIconImage();
      this.serverErrors = {};
      this.$v.$reset();
    },
    updateNameClassification(payload) {
      this.$v.edition.name_classification.$model =
        payload.classification_string;
      this.edition.name_classification_xml = payload.classification_xml;
    },
    updateIconImage() {
      this.iconImage = null;
      this.iconLoading = true;
      const img = new Image();
      img.onload = () => {
        this.iconImage = img;
        this.iconLoading = false;
      };
      img.onerror = () => {
        this.iconLoading = false;
      };
      img.src = this.edition.icon;
    },
  },
};
</script>

<style scoped lang="scss">
// Known bootstrap bug hiding feedback for form-file even when invalid
::v-deep .form-group {
  .invalid-feedback {
    display: block;
  }
}
::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
</style>
