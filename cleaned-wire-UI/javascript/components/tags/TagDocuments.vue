<template>
  <div>
    <DocumentsActionBar
      :products="products"
      :entityId="entityId"
      :removeable="removable"
      :showSpinner="showSpinner"
      @selectDeselectAll="selectDeselectAll"
      @exportDocs="exportDocs"
      @removeDocs="removeDocs"
    />
    <div
      v-for="document in products"
      :key="`${document.id}=${tagName}`"
      :class="showSpinner ? 'd-none' : ''"
    >
      <b-form-checkbox
        v-model="products[documentIndex(document.id)].selected"
        class="mb-3"
      >
        <DocumentLink :document="document" section="none" returnPath="/" />
        <div v-if="document.tagged_by && !removable" class="tagged-by">
          {{ taggedBy(document.tagged_by.length) }}
          <b-btn
            v-for="(user, idx) in document.tagged_by"
            :key="user.id"
            :to="`/users/${user.id}/tags?user_name=${user.name}`"
            variant="link"
            size="md"
            class="pl-0 text-left"
          >
            {{ user.name }}{{ addSeparator(idx, document.tagged_by.length) }}
          </b-btn>
        </div>
      </b-form-checkbox>
    </div>
    <div class="overflow-auto text-center mt-5" v-if="tag.pages > 1">
      <div class="d-flex justify-content-center">
        <b-pagination-nav
          :link-gen="paginationLink"
          :number-of-pages="tag.pages"
          @change="$emit('loadTagDocs')"
        ></b-pagination-nav>
      </div>
    </div>
  </div>
</template>

<script>
import DocumentsActionBar from "../shared/DocumentsActionBar";
import DocumentLink from "../shared/DocumentLink/index";
import { mapGetters } from "vuex";
import { snakeCase } from "lodash";

export default {
  name: "TagDocuments",
  components: { DocumentLink, DocumentsActionBar },
  props: {
    tag: {
      type: Object,
      required: true,
    },
    removable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters("tags", ["showSpinner"]),
    products() {
      return this.tag.products;
    },
    productIdsSelected() {
      let products = this.products.filter((doc) => doc.selected == true);
      return products.map((product) => product.id);
    },
    tagName() {
      return this.tag.name;
    },
    entityId() {
      return snakeCase(this.tagName);
    },
  },
  methods: {
    documentIndex(documentId) {
      let doc = this.products.find((document) => document.id === documentId);
      return this.products.indexOf(doc);
    },
    paginationLink(pageNum) {
      var query = Object.assign({}, this.$route.query);
      query.page = pageNum;
      return {
        name: this.$route.name,
        query: query,
      };
    },
    exportDocs(exportType) {
      this.$store.dispatch("tags/exportTag", {
        exportType: exportType,
        tagId: this.tagName,
        productIds: this.productIdsSelected,
        userId: this.$route.params.id,
        caller: this,
      });
    },
    removeDocs() {
      this.$store.dispatch("tags/removeProductsFromTag", {
        groupName: this.$route.query.tag_group,
        tagName: this.tagName,
        productIds: this.productIdsSelected,
        caller: this,
      });
    },
    selectDeselectAll(selectAll) {
      this.products.forEach((doc) => (doc.selected = selectAll));
    },
    taggedBy(tagged_by_count) {
      let label = tagged_by_count > 1 ? "people" : "person";
      return `Tagged by ${tagged_by_count} ${label}:`;
    },
    addSeparator(idx, tagged_by_count) {
      let lastIndex = tagged_by_count - 1;
      return idx !== lastIndex ? ", " : "";
    },
  },
};
</script>

<style scoped></style>
