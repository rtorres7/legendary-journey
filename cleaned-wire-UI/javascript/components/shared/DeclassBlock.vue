<template>
  <div
    class="declass-block"
    v-if="
      document.classification &&
      !document.classification.includes('UNCLASSIFIED')
    "
  >
    <template v-if="document.classification_detail">
      <span v-if="document.classification_detail.cl_by">
        <strong>Classified By: </strong>
        {{ document.classification_detail.cl_by }}
      </span>
      <span>
        <strong>Derived From:</strong>
        {{ document.classification_detail.drv_from }}
      </span>
      <span>
        <strong>Declassify On: </strong>
        {{ document.classification_detail.decl_on }}
      </span>
    </template>

    <p class="subtitle" v-else v-html="formattedDeclassBlock()"></p>
  </div>
</template>

<script>
export default {
  name: "DeclassBlock",
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formattedDeclassBlock() {
      if (this.document.declass_block) {
        return this.document.declass_block
          .replace(/:/g, ":</strong>")
          .replace(/<br \/>/, "<strong>")
          .replace(/^/g, "<strong>");
      }
    },
  },
};
</script>
