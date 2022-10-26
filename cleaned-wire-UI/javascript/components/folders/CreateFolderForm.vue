<template>
  <div :class="showHeader ? 'mt-6' : ''">
    <h2 v-if="showHeader">Create a Folder</h2>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group id="folder-name" label-for="folder-name-input">
        <label>{{ label }}</label>
        <b-input
          id="folder-name-input"
          aria-describedby="new-folder-live-feedback"
          :state="$v.newFolder.$dirty ? !$v.newFolder.$error : null"
          v-model="$v.newFolder.$model"
          :placeholder="docNum ? 'Enter a new folder name' : ''"
          class="mb-3"
          @focus="folderInputInFocus"
        >
        </b-input>
        <b-form-invalid-feedback
          id="new-folder-live-feedback"
          aria-live="polite"
          class="mb-3"
        >
          Enter a new folder, at least 3 characters.
        </b-form-invalid-feedback>
        <b-row class="d-flex px-2">
          <b-btn variant="primary" :disabled="$v.$invalid" type="submit"
            >Create</b-btn
          >
          <router-link
            :to="{ name: 'folders' }"
            v-if="docNum"
            class="ml-auto p-3"
          >
            <img class="icon" :src="require('@assets/folders-icon.svg')" />
            View My Folders</router-link
          >
        </b-row>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { requiredIf, minLength } from "vuelidate/lib/validators";

export default {
  name: "CreateFolderForm",
  mixins: [validationMixin],
  data() {
    return {
      newFolder: "",
      form: {
        folderName: "",
      },
    };
  },
  props: {
    showHeader: {
      default: true,
    },
    label: {
      default: "Enter your folder name",
    },
    // providing a doc num will add the document to the folder upon creation
    docNum: {
      required: false,
    },
  },
  methods: {
    folderInputInFocus() {
      // Accessibility Fix
      // In Firefox when tabbing to folder input form element and there is a
      // long list of folders, without this scroll up, input form is not visible
      window.scrollTo(0, 0);
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$store.dispatch("folders/createFolder", {
        folderName: this.newFolder,
        docNum: this.docNum,
        caller: this,
      });
      this.$v.$reset();
      this.newFolder = "";
    },

    onReset(evt) {
      evt.preventDefault();
      this.$v.$reset();
      this.newFolder = "";
    },
  },
  validations: {
    newFolder: {
      requiredIf: requiredIf(function () {
        return this.newFolder === "";
      }),
      minLength: minLength(3),
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

.icon {
  height: 24px;
  width: 24px;
}
</style>
