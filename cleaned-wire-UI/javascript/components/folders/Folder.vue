<template>
  <div class="mr-7 mt-6">
    <div class="d-flex separator">
      <b-btn
        class="folder-title _temp_488-0"
        variant="link"
        :id="'folder-contents-' + folder.id + '_btn'"
        v-b-toggle="'folder-contents-' + folder.id"
        @click="selectFolder"
      >
        {{ folder.name }} <span class="sr-only"> folder</span>
        <span class="folder-count"
          >({{ folder.document_count
          }}<span class="sr-only"> documents</span>)</span
        >
      </b-btn>
      <div class="d-flex align-items-center ml-auto">
        <DeleteButton
          :url="'/my_wire/folders/' + folder.id"
          :label="folder.name"
          type="folder"
          :caller="this"
        />
      </div>
    </div>
    <b-collapse
      :id="'folder-contents-' + folder.id"
      v-model="expanded"
      accordion="folder-accordion"
      @shown="updateFocus(`#folder-contents-${folder.id}_btn`)"
    >
      <DocumentsActionBar
        :articles="articles"
        :entityId="folder.id + '-' + layout"
        :showSpinner="showSpinner"
        noItems="This folder is empty."
        removeable
        @selectDeselectAll="selectDeselectAll"
        @exportDocs="exportDocs"
        @removeDocs="removeDocs"
      />
      <div
        v-for="document in articles"
        :key="`${document.id}=${folder.name}`"
        :class="showSpinner ? 'd-none' : ''"
      >
        <b-form-checkbox
          v-model="folder.articles[documentIndex(document.id)].selected"
          class="mb-3"
        >
          <DocumentLink :document="document" section="none" returnPath="/" />
        </b-form-checkbox>
      </div>
      <div class="overflow-auto text-center mt-5" v-if="folder.pages > 1">
        <div class="d-flex justify-content-center">
          <b-pagination-nav
            :link-gen="paginationLink"
            :number-of-pages="folder.pages"
            @change="loadFolders"
          ></b-pagination-nav>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import DeleteButton from "../shared/DeleteButton";
import DocumentLink from "../shared/DocumentLink/index";
import DocumentsActionBar from "../shared/DocumentsActionBar";
import { mapGetters } from "vuex";

export default {
  name: "Folder",
  components: { DeleteButton, DocumentLink, DocumentsActionBar },
  props: {
    folder: {
      default: null,
    },
    layout: {
      type: String,
      default: "TwoColumns",
    },
  },
  data() {
    return {
      expanded: this.$route.params.folderId == this.folder.id,
    };
  },
  computed: {
    ...mapGetters("folders", ["showSpinner"]),
    articles() {
      return this.folder.articles;
    },
    articleIdsSelected() {
      let articles = this.folder.articles.filter((doc) => doc.selected == true);
      return articles.map((article) => article.id);
    },
  },
  methods: {
    selectFolder() {
      this.$router.push({
        name: "folder",
        params: { folderId: this.folder.id },
        query: { page: 1 },
      });
    },
    loadFolders() {
      this.$store.dispatch("folders/loadFolders", { caller: this });
    },
    exportDocs(exportType) {
      this.$store.dispatch("folders/exportFolder", {
        exportType: exportType,
        folderId: this.folder.id,
        articleIds: this.articleIdsSelected,
        caller: this,
      });
    },
    removeDocs() {
      this.$store.dispatch("folders/removeArticlesFromFolder", {
        folderId: this.folder.id,
        articleIds: this.articleIdsSelected,
        caller: this,
      });
    },
    deleted() {
      this.$wireNotification({
        title: "Folder Deleted",
        duration: 5000,
        text: "Folder '" + this.folder.name + "' has been  deleted",
        type: "success",
      });
      this.$router.push({
        name: "folders",
        query: { page: 1 },
      });
      this.loadFolders();
    },
    deletionFailed() {
      this.$wireNotification({
        title: "Folder deletion failed",
        duration: 5000,
        text: "Failed to delete folder '" + this.folder.name + "'",
        type: "error",
      });
      this.loadFolders();
    },
    selectDeselectAll(selectAll) {
      this.folder.articles.forEach((doc) => (doc.selected = selectAll));
    },
    documentIndex(documentId) {
      let doc = this.folder.articles.find(
        (document) => document.id === documentId
      );
      return this.folder.articles.indexOf(doc);
    },
    documentLink(document) {
      return `/documents/${document.doc_link}/`;
    },
    paginationLink(pageNum) {
      return {
        name: this.$route.name,
        params: this.$route.params,
        query: { page: pageNum },
      };
    },
    updateFocus(accordionSelector) {
      document.querySelector(accordionSelector).focus();
    },
  },
};
</script>

<style scoped lang="scss">
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
.folder-title {
  font-family: $heading-stylized;
  font-size: $font-size-4;
}
.folder-count {
  font-family: $font-family-heading;
}
.fa-times-circle {
  color: $alt-500;
}
/deep/ .disabled {
  color: $alt-900;
}
/deep/ .dropdown-menu {
  min-width: 7rem;
}
/deep/ a.dropdown-item {
  padding-left: 5px;
}
img {
  height: 16px;
  width: 16px;
}
</style>
