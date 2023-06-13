<template>
  <b-row>
    <b-col>
      <DocumentLink
        v-if="!confirm"
        :document="product.document"
        section="none"
        returnPath="/"
        data-usage="doc-related-products"
      />
      <span class="pl-0" v-if="confirm && canManage">
        <b-button
          :disabled="confirmClicked"
          :id="`confirm-delete-${product.id}`"
          class="confirm-delete ml-auto"
          size="sm"
          variant="danger"
          @click.stop.prevent
          @click="deleteRelatedDoc"
        >
          Confirm Removal of {{ product.document.title }}?
        </b-button>
        <b-button
          class="mx-3"
          size="sm"
          variant="link"
          @click="confirm = false"
        >
          Cancel
        </b-button>
      </span>
    </b-col>
    <b-col cols="2" v-if="canManage && draggable">
      <i
        class="fa fa-align-justify sort-handle"
        :id="`sort-handle-${product.id}`"
      ></i>
      <b-tooltip :target="`sort-handle-${product.id}`" placement="top">
        Drag to reorder</b-tooltip
      >
    </b-col>
    <b-col cols="2">
      <b-button
        v-if="!confirm && canManage"
        variant="link"
        size="sm"
        @click.stop.prevent
        @click="askForConfirm"
      >
        <img
          :src="require('@assets/delete-icon.svg')"
          class="delete-icon"
          alt="remove"
        />
      </b-button>
    </b-col>
  </b-row>
</template>

<script>
import DocumentLink from "../shared/DocumentLink/index";
import axios from "axios";

export default {
  name: "RelatedProduct",
  components: { DocumentLink },
  data() {
    return {
      confirm: false,
      confirmClicked: false,
    };
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    canManage: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    docNum() {
      return this.$route.params["docNum"];
    },
    relatedDocPath() {
      return "/documents/" + this.docNum + "/related_documents";
    },
  },
  methods: {
    askForConfirm() {
      this.confirm = true;
      this.$nextTick(() => {
        let confirmDeleteBtn = document.querySelector(
          `#confirm-delete-${this.product.id}`
        );
        if (confirmDeleteBtn) {
          confirmDeleteBtn.focus();
        }
      });
    },
    deleteRelatedDoc() {
      this.confirmClicked = true;

      axios({
        method: "delete",
        _temp_1: `${this.relatedDocPath}/${this.product.id}.json`,
      })
        .then((response) => {
          this.$emit("removeProduct", this.product.id);
          this.$wireNotification({
            title: "Related Product Removed",
            duration: 5000,
            text: "Selected product has been removed from this product.",
            type: "success",
          });
        })
        .catch((error) => {
          console.log(error);
          this.$wireNotification({
            title: "Error",
            duration: 5000,
            text: "Failed to remove related product.",
            type: "error",
          });
        });

      this.confirm = false;
      this.confirmClicked = false;
    },
  },
};
</script>

<style scoped lang="scss">
.delete-icon {
  height: 10px;
  width: 10px !important;
}
.sort-handle {
  padding: 0.5rem;
  cursor: move;
  &:focus {
    outline: 1px dotted $alt-500 !important;
  }
}
.btn {
  &:focus {
    outline: 1px dotted $alt-500 !important;
  }
}
</style>
