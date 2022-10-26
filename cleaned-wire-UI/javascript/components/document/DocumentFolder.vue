<template>
  <div v-if="!loading">
    <b-modal
      id="folder-article"
      size="sm"
      title="Add Document to Folders"
      title-class="modal-header-title"
      @ok="addToFolders"
      :ok-disabled="!folderSelected"
      ok-title="Add to Selected Folder(s)"
    >
      <b-card>
        <CreateFolderForm
          :docNum="document.doc_num"
          :showHeader="false"
          :label="`Create private folders to organize ${name} products.`"
        ></CreateFolderForm>

        <hr />

        <b-row v-if="!folders.loading" class="pb-3">
          <b-form-group
            id="folder_list"
            v-if="folders.folders"
            label="Select folders below to file this document there."
            v-slot="{ ariaDescribedby }"
            class="pb-5"
          >
            <b-form-checkbox
              v-model="selected"
              v-for="folder in folders.folders"
              :key="folder.name"
              :value="folder.name"
              :disabled="includedInFolder(folder)"
              :aria-describedby="ariaDescribedby"
              name="folder-names"
              stacked
            >
              <router-link
                :to="{ name: 'folder', params: { folderId: folder.id } }"
              >
                {{ folder.name }} ({{ folder.document_count }})</router-link
              ></b-form-checkbox
            >
            <p v-if="folders.folders.length === 0" class="px-4 text-italic">
              You have no folders.
            </p>
          </b-form-group>
        </b-row>
      </b-card>
    </b-modal>
  </div>
</template>

<script>
import CreateFolderForm from "../folders/CreateFolderForm";
import axios from "axios";
import { mapGetters, mapState } from "vuex";
import { find } from "lodash";

export default {
  name: "DocumentFolder",
  components: {
    CreateFolderForm,
  },
  data() {
    return {
      previouslySelectedCount: 0,
      selected: [],
      folderName: "",
      working: false,
    };
  },
  mounted() {
    this.loadFolders();
    this.setSelectedFolders();
  },
  computed: {
    ...mapState("metadata", ["name"]),
    ...mapGetters("folders", ["folders", "loading"]),
    folderSelected() {
      return this.selected.length > this.previouslySelectedCount;
    },
  },
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  watch: {
    folders() {
      this.setSelectedFolders();
      this.previouslySelectedCount = this.selected.length;
    },
    $route() {
      this.setSelectedFolders();
    },
  },
  methods: {
    loadFolders() {
      this.$store.dispatch("folders/loadFolders", { caller: this });
    },
    includedInFolder(folder) {
      let doc = find(folder.articles, ["id", this.document.id]);
      return doc !== undefined;
    },
    setSelectedFolders() {
      this.selected = [];
      if (this.folders.folders) {
        this.folders.folders.forEach((folder) => {
          if (this.includedInFolder(folder)) {
            this.selected.push(folder.name);
          }
        });
      }
    },
    addToFolders() {
      let formData = new FormData();
      this.selected.forEach((name) => {
        formData.append(`folders[${name}]`, 1);
      });
      formData.append("document_id", this.document.doc_num);
      axios({
        method: "PUT",
        _temp_1: "/my_wire/folders/update.json",
        data: formData,
      })
        .then((response) => {
          this.$wireNotification({
            title: "Document Added To Folder(s)",
            duration: 5000,
            text: "This document has been added to the selected folder(s).",
            type: "success",
          });
          this.loadFolders();
          document.querySelector("#add-to-folder").focus();
        })
        .catch((e) => {
          this.$wireNotification({
            type: "error",
            title: "Error adding document to folders",
            text: "Failed to add document to selected folder(s)",
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}

#folder_list {
  max-height: 15em;
  overflow-y: auto;
  overflow-x: hidden;
}

.custom-checkbox {
  padding-left: 2rem;
}

::v-deep label,
::v-deep legend {
  color: black;
  font-style: normal !important;
  justify-content: left;
}
</style>
